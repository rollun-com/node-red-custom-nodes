module.exports = (function () {
  global.delovod = {
    util: {
      formatDelovodRequest: (params, action, {key, version}) => `packet=${JSON.stringify({
        version,
        key,
        action,
        params
      })}`,
    },
    actions: {
      GET_OBJECT: 'getObject',
      SAVE_OBJECT: 'saveObject',
      SET_DEL_MARK: 'setDelMark',
      REQUEST: 'request'
    },
    DelovodAPIClient: class DelovodAPIClient {
      constructor({key, version, host}) {

        /**
         * @type key {string} delovod API key
         */
        this.key = key;

        /**
         * @type version {string} delovod API version
         */
        this.version = version;

        /**
         * @type {{getObject: 'getObject', saveObject: 'saveObject', setDelMark: 'setDelMark', request: 'request'}}
         */

        this.actions = {
          getObject: 'getObject',
          saveObject: 'saveObject',
          setDelMark: 'setDelMark',
          request: 'request'
        }

        /**
         *
         * @type {AxiosInstance}
         */
        this.axios = require('axios').create({
          baseURL: host,
          timeout: 10000,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })

        this.axios.interceptors.request.use(config => {
          console.log(config)
          const {data} = config;
          data.key = this.key;
          data.version = this.version;
          config.data = `packet=${JSON.stringify(data)}`
          return config;
        })
      }

      /**
       *
       * @param action {action}
       * @param params
       * @return {Promise<AxiosResponse<any>>}
       */

      async request(action, params) {
        if (!this.actions[action]) throw new Error(`Unknown action - ${action}, must be one of ${Object.keys(this.actions)}`);
        return this.axios.post('', {action, params})
          .then(({data}) => {
            if (data.error) {
              throw new Error(data.error);
            }
            return data
          })
      }

    }
  };
})();
