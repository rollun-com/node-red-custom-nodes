module.exports = function () {
  const fs = require('fs');
  const _ = require('lodash');
  const qs = require('querystring');

  global.ebay = {
    util: {
      getQueryParamType: (value) => {
        if (!value) return 'empty';
        if (value.from) return 'datetime';
        if (Array.isArray(value)) return 'array';
        if (typeof value === 'object') return 'object';
        if (typeof value === 'string' || typeof value === 'number') return 'primitive';
        return 'unknown';
      },
      stringifyDatetime: (name, {from, to = ''}, isInner = true) => {
        return `${name}${isInner ? ':' : '='}[${from}..${to}]`;
      },
      stringifyArray: (name, value, isInnerArray = false) => {
        return `${name}${isInnerArray ? ':' : '='}${value.join(',')}`
      },
      stringifyObject: (name, value) => {
        return `${name}=${Object.entries(value).map(([key, value]) => {
          const valueType = this.getQueryParamType(value);
          if (valueType === 'datetime') {
            return this.stringifyDatetime(key, value);
          }
          if (valueType === 'array') {
            return this.stringifyArray(key, value, true);
          }
          if (valueType === 'primitive') {
            return this.stringifyPrimitive(name, value, true);
          }
          return `${name}=${value}`;
        }).join(',')}`
      },
      stringifyPrimitive: (name, value, isInner = false) => {
        if (isInner) {
          return `${name}:{${value}}`;
        }
        return `${name}=${value}`;
      },
      stringifyQuery: (query) => {
        return Object.entries(query)
          .filter(([, value]) => value && _.size(value) > 0)
          .map(([key, value]) => {
            switch (this.getQueryParamType(value)) {
              case 'datetime':
                return this.stringifyDatetime(name, value, false);
              case 'array':
                return this.stringifyArray(name, value);
              case 'object':
                return this.stringifyObject(name, value);
              case 'primitive':
                return this.stringifyPrimitive(name, value)
              default:
                return `${key}=${value}`
            }
          }).join('&');
      }
    },
    OAUTH_SCOPES: {
      sell: {
        marketing: 'sell.marketing',
        marketingReadonly: 'sell.marketing.readonly',
        inventory: 'sell.inventory',
        inventoryReadonly: 'sell.inventory.readonly',
        account: 'sell.account',
        accountReadonly: 'sell.account.readonly',
        fulfillment: 'sell.fulfillment',
        fulfillmentReadonly: 'sell.fulfillment.readonly',
        analyticsReadonly: 'sell.analytics.readonly',
        finances: 'sell.finances',
        payment: 'sell.payment.dispute'
      },
      commerce: {
        identityReadonly: 'commerce.identity.readonly'
      }
    },
    createEbayApi: ({
                      refreshToken,
                      clientId,
                      clientSecret,
                      scopes
                    }) => {

      const axios = require('axios').create({})

      const cacheFileName = '/data/.ebay-auth-token.json';

      const oauthScopeBasePath = 'https://api.ebay.com/oauth/api_scope/';

      const getCachedToken = () => {
        try {
          if (fs.existsSync(cacheFileName)) {
            const file = fs.readFileSync(cacheFileName, 'utf8');
            const data = JSON.parse(file);
            if (!data.access_token || !data.expires_in || !data.created_at) {
              throw new Error('invalid file format - ' + file);
            }
            if ((Date.now() / 1000 - data.created_at) > data.expires_in) {
              throw new Error(`Token expired - now(${Date.now()}) - created at(${data.created_at}) = ${Date.now() / 1000 - data.created_at} > expires in(${data.expires_in})`)
            }
            return data.access_token;
          }
        } catch (err) {
          console.log('getting cached token error ', err);
          return null;
        }
      }

      const getAuthToken = async () => {
        const cachedToken = getCachedToken();
        if (cachedToken) {
          return cachedToken;
        }
        try {
          const {data} = await axios.post('https://api.ebay.com/identity/v1/oauth2/token', Object.entries({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            scope: encodeURI(scopes.join(' '))
          }).map(([key, value]) => `${key}=${value}`).join('&'), {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
              Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
            }
          })

          fs.writeFileSync(cacheFileName, JSON.stringify({
            ...data,
            created_at: Math.floor(Date.now() / 1000)
          }))
          return data.access_token;
        } catch (e) {
          throw new Error(`Error while fetching eBay oauth token - ${e.message}`);
        }
      }
      axios.interceptors.request.use(async config => {
        if (config.url.includes('identity/v1/oauth2/token')) return config;
        const token = await getAuthToken();
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      })

      return axios;
    },
    EbayAPI: class EbayAPI {

      constructor({
                    refreshToken,
                    clientId,
                    clientSecret,
                    scopes = [
                      "https://api.ebay.com/oauth/api_scope",
                      "https://api.ebay.com/oauth/api_scope/sell.marketing.readonly",
                      "https://api.ebay.com/oauth/api_scope/sell.marketing",
                      "https://api.ebay.com/oauth/api_scope/sell.inventory.readonly",
                      "https://api.ebay.com/oauth/api_scope/sell.inventory",
                      "https://api.ebay.com/oauth/api_scope/sell.account.readonly",
                      "https://api.ebay.com/oauth/api_scope/sell.account",
                      "https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly",
                      "https://api.ebay.com/oauth/api_scope/sell.fulfillment",
                      "https://api.ebay.com/oauth/api_scope/sell.analytics.readonly",
                      "https://api.ebay.com/oauth/api_scope/sell.finances",
                      "https://api.ebay.com/oauth/api_scope/sell.payment.dispute",
                      "https://api.ebay.com/oauth/api_scope/commerce.identity.readonly"
                    ]
                  } = {}) {
        if (!refreshToken) {
          throw new Error(`refreshToken is required!`);
        }

        if (!clientId) {
          throw new Error(`clientId is required!`);
        }

        if (!clientSecret) {
          throw new Error(`clientSecret is required!`);
        }

        if (!scopes) {
          throw new Error(`scopes are required!`);
        }

        this.api = global.ebay.createEbayApi({
          refreshToken,
          clientId,
          clientSecret,
          scopes
        })

        this.API_HOSTS = {
          APIZ: 'https://apiz.ebay.com',
          API: 'https://api.ebay.com'
        }
        this.sell = new global.ebay.Sell(this.api);
      }
    },
    Sell: class EbaySell {
      constructor(api) {
        this.api = api;
        this.API_HOSTS = {
          APIZ: 'https://apiz.ebay.com/sell',
          API: 'https://api.ebay.com/sell'
        }
      }

      /**
       *
       * @param limit
       * @param offset
       * @param filter - example - {
       *   transactionDate: {
       *     from: '2018-10-23T00:00:01.000Z'
       *     to: '2018-11-09T00:00:01.000Z'    // can be empty
       *   },
       *   transactionStatus: 'PAYOUT', // one of - (PAYOUT, FUNDS_PROCESSING, FUNDS_AVAILABLE_FOR_PAYOUT, FUNDS_ON_HOLD, COMPLETED, FAILED)
       *   orderId: '03-03620-33763',
       *   transactionId: '03-03620-33763'
       * }
       * @param sort
       * @return {*}
       * @doc https://developer.ebay.com/api-docs/sell/finances/resources/transaction/methods/getTransactions
       */

      getTransactions({
                        limit = 20,
                        offset = 0,
                        filter = {}
                      }) {

        return this.api.get(
          this.API_HOSTS.APIZ +
          '/finances/v1/transaction?' + global.ebay.util.stringifyQuery({
            limit, offset,
            filter
          }));

      }

      /**
       * @doc https://developer.ebay.com/api-docs/sell/fulfillment/resources/order/methods/getOrder
       * @param orderId
       * @return {*}
       */

      getOrder(orderId) {
        return this.api.get(
          this.API_HOSTS.API +
          `/fulfillment/v1/order/${orderId}`
        )
      }

      /**
       * @doc https://developer.ebay.com/api-docs/sell/fulfillment/resources/order/methods/getOrders
       */

      getOrders({
                  orderIds,
                  filter = {},
                  limit = 100,
                  offset = 0
                }) {
        return this.api.get(
          this.API_HOSTS.API +
          `/fulfillment/v1/order?` +
          global.ebay.util.stringifyQuery({
            orderIds,
            filter,
            limit,
            offset
          })
        )
      }
    }
  }
}
