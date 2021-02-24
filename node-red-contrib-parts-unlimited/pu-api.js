const fs = require('fs');
const {promisify} = require('util');
const _ = require('lodash');
const {wait} = require('../node-red-contrib-common-utils/1-global-utils');

class PartsUnlimitedAPI {
  constructor({login, dealerNumber, password}) {
    this.api = this._createPUApi(login, dealerNumber, password);
    this.ORDER_TYPES = ['open', 'submitted', 'backordered'];
  }

  _createPUApi(login, dealerNumber, password) {
    const axios = require('axios').create({
      baseURL: 'https://dealer.parts-unlimited.com',
      headers: {
        'Accept': 'application/json',
        'content-type': 'application/json'
      },
    });

    const sessionCacheFileName = `${Buffer.from(login + dealerNumber).toString('base64')}-pu-session-cache.json`;

    const getCachedSession = async () => {
      try {
        if (fs.existsSync(sessionCacheFileName)) {
          const file = await promisify(fs.readFile)(sessionCacheFileName, 'utf8');
          const data = JSON.parse(file);
          if (!data.session || !data.expires_in || !data.created_at) {
            throw new Error('invalid file format');
          }
          if ((Date.now() / 1000 - data.created_at) > data.expires_in) {
            throw new Error(`Token expired - now(${Date.now()}) - created at(${data.created_at}) = ${Date.now() / 1000 - data.created_at} > expires in(${data.expires_in})`)
          }
          return data.session;
        }
      } catch (err) {
        console.log(err);
        return null;
      }
    }

    const getSession = async () => {
      const cachedSession = await getCachedSession();
      if (cachedSession) {
        return cachedSession;
      }
      try {
        const {headers} = await axios.put('/api/login?t=' + Date.now(), {
          username: login,
          password,
          dealerCode: dealerNumber,
        });
        const cookies = headers['set-cookie'];
        if (!cookies) {
          throw new Error('No cookies returned from PU login endpoint');
        }
        const visitCookie = cookies.find(str => str.startsWith('visit'));
        if (!visitCookie) {
          throw new Error('No `visit` cookie returned from PU login endpoint');
        }
        const parsedCookie = visitCookie.split(';').reduce((acc, str) => {
          const [key, val] = str.split('=');
          return {
            ...acc,
            [key.trim().toLowerCase()]: val ? val.trim() : ''
          }
        }, {})
        fs.writeFileSync(sessionCacheFileName, JSON.stringify({
          session: cookies,
          expires_in: +parsedCookie['max-age'],
          created_at: Math.floor(Date.now() / 1000)
        }))
        return cookies;
      } catch (e) {
        throw new Error(`Error while fetching Parts Unlimited API session - ${e.message}`);
      }
    };

    axios.interceptors.request.use(async config => {
      if (config.url.includes('api/login')) return config;
      config.headers.cookie = await getSession();
      config.params = {
        ...(config.params && config.params),
        t: Date.now(),
      }
      console.log(config.url, config.params);
      return config;
    })

    return axios;
  }

  _getDateString(date, isEnd = false) {
    const d = new Date(date);
    if (d.toString() === 'Invalid Date') {
      throw new Error('Date is invalid, should be yyyy-mm-dd or ISO.');
    }

    const [dateStr] = d.toISOString().split('T');

    return `${dateStr}T${isEnd ? '23:59.00' : '00:00:00'}.000Z`;
  }

  /**
   *
   * @param type {'open'|'submitted'|'backordered'}
   * @param invoiceNumber
   * @param poNumber
   * @param startDate
   * @param endDate
   * @param limit
   * @param offset
   * @return {Promise<any>}
   */

  async getOpenOrdersOfType(type, {invoiceNumber, poNumber, startDate, endDate, limit, offset}) {
    const {data: {orders}} = await this.api.get(`/api/orders/${type}`, {
      params: {
        poNumber,
        startDate: startDate ? this._getDateString(startDate) : undefined,
        endDate: endDate ? this._getDateString(endDate, true) : undefined,
        limit,
        offset,
        invoiceNumber,
      }
    });

    return orders || [];
  }

  async getOpenOrders(data) {
    return this.getOpenOrdersOfType('open', data);
  }

  async getSubmittedOrders(data) {
    return this.getOpenOrdersOfType('submitted', data);
  }

  async getBackorderedOrders(data) {
    return this.getOpenOrdersOfType('backordered', data);
  }

  async getAllOrders(data) {
    let result = [];

    for (const type of this.ORDER_TYPES) {
      result = result.concat(await this.getOpenOrdersOfType(type, data));
      await wait(2000);
    }

    return result.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1);
  }

  async getOrderById({id}) {
    const {data} = await this.api.get('/api/orders/' + id);

    return data;
  }
}

module.exports = {
  PartsUnlimitedAPI
}
