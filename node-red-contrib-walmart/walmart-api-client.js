const fs = require('fs');
const {randomString} = require('rollun-ts-utils');

module.exports = class WalmartAPI {
  constructor({clientId, clientSecret, correlationId}) {

    this.axios = require('axios').create({
      baseURL: 'https://marketplace.walmartapis.com',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'WM_SVC.NAME': 'Walmart Marketplace',
        'WM_SVC.VERSION': '1.0.0'
      }
    })

    /**
     * @type {{expires_in: number, access_token: string, created_at: number} | null}
     */

    this.correlationId = '1234hfvgt';//correlationId;

    this.authToken = null;

    this.axios.interceptors.request.use(async config => {
      if (config.url === '/v3/token') return config;
      const token = await this._getAuthToken(clientId, clientSecret);
      config.headers.Authorization = this._getAuthHeader(clientId, clientSecret);
      config.headers['WM_QOS.CORRELATION_ID'] = this.correlationId;
      config.headers['WM_SEC.ACCESS_TOKEN'] = token;
      return config;
    })
  }

  _getAuthHeader(clientId, clientSecret) {
    return `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`;
  }

  async _getAuthToken(clientId, clientSecret) {
    const cachedToken = this._getCachedToken();
    if (cachedToken) {
      return cachedToken;
    }
    console.log('fetch new token');
    const {data} = await this.axios.post('/v3/token', 'grant_type=client_credentials', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: this._getAuthHeader(clientId, clientSecret),
        'WM_SVC.NAME': 'Walmart Marketplace',
        'WM_QOS.CORRELATION_ID': this.correlationId,
        'WM_SVC.VERSION': '1.0.0'
      }
    })
    this.authToken = {
      ...data,
      created_at: Math.floor(Date.now() / 1000),
    }

    // cache token on disk
    fs.writeFile('/data/.walmart-auth-token.json', JSON.stringify(this.authToken), (err) => {
      if (err) {
        console.warn('Could cache walmart token on disk');
      }
    });

    return this.authToken.access_token;
  }

  _getCachedToken() {
    const isExpired = data => {
      if (!data.access_token || !data.expires_in || !data.created_at) {
        console.log('invalid file format - ' + data);
        return false
      }
      if ((Date.now() / 1000 - data.created_at) > data.expires_in) {
        console.log(`Token expired - now(${Date.now()}) - created at(${data.created_at}) = ${Date.now() / 1000 - data.created_at} > expires in(${data.expires_in})`)
        return true;
      }
      return false;
    }

    if (this.authToken === null) {
      const cacheTokenFile = '/data/.walmart-auth-token.json';
      try {
        this.authToken = JSON.parse(fs.readFileSync(cacheTokenFile, 'utf8'));
      } catch (e) {
        return null;
      }
    }

    return isExpired(this.authToken) ? null : this.authToken.access_token;
  }

  /**
   *
   * @param uri {string}
   * @param method {"get"|"post"|"delete"|"put"}
   * @param body {*}
   * @return {Promise<*>}
   */

  async baseRequest(uri, method, body = undefined) {
    const {data} = await this.axios[method](uri, body);
    return data;
  }

  async getOrders({createdStartDate, createdEndDate}) {
    const query = createdStartDate ? `createdStartDate=${createdStartDate}` : '';
    return this.baseRequest(`/v3/orders?${query}`, 'get');
  }

  async getOrder({orderId}) {
    return this.baseRequest(`/v3/orders/${orderId}?productInfo=true`, 'get');
  }

}
