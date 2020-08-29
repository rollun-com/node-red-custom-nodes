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
         * @type {{SAVE: '0', REGISTER: '1', UNREGISTER: '2'}}
         */

        this.saveTypes = {
          SAVE: '0',
          REGISTER: '1',
          UNREGISTER: '2'
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
          const {data} = config;
          data.key = this.key;
          data.version = this.version;
          config.data = `packet=${JSON.stringify(data)}`
          return config;
        })
      }

      /**
       *
       * @param action {"getObject" | "saveObject" | "setDelMark" | "request"}
       * @param params
       * @return {Promise<{result: "ok"}>}
       */

      async baseRequest(action, params) {
        if (!this.actions[action]) throw new Error(`Unknown action - ${action}, must be one of ${Object.keys(this.actions)}`);
        const {data} = await this.axios.post('', {action, params});
        if (data === 'ok') {
          return {result: 'ok'};
        }
        if (data.error) throw new Error(data.error);
        return data;
      }

      /**
       *
       * @param type {string}
       * @param fields
       * @param filters
       * @return {Promise<AxiosResponse<any>>}
       */

      async request(type, filters, fields = {}) {
        const _fields = filters
          // remove filters without {alias} field
          .map(filter => filter.alias)
          // filter empty {alias}
          .filter(name => !!name)
          // add fields from filter to select.
          .reduce((fields, name) => {
            fields[name] = name;
            return fields;
          }, {});

        // always add id to select
        if (!("id" in _fields)) {
          _fields.id = 'id';
        }

        const result = await this.baseRequest(this.actions.request, {
          from: type,
          fields: _fields,
          filters
        })
        return result;
      }

      /**
       *
       * @param header
       * @param tableParts
       * @param saveType {"SAVE" | "REGISTER" | "UNREGISTER"}
       * @return {Promise<AxiosResponse<*>>}
       */

      async saveObject(header, tableParts, saveType = 'SAVE') {
        return this.baseRequest(this.actions.saveObject, {
          saveType: this.saveTypes[saveType],
          header,
          ...(tableParts && {tableParts})
        })
      }

      /**
       *
       * @param id
       * @return {Promise<AxiosResponse<*>>}
       */

      async getObject(id) {
        if (!id) throw new Error('Id cannot be empty');
        return this.baseRequest(this.actions.getObject, {id})
      }

      /**
       * Sets delete mark on document, and also can delete this document
       * @param id
       * @param forceDelete
       * @return {Promise<AxiosResponse<*>>}
       */
      async setDelMark(id, forceDelete = false) {
        if (!id) throw new Error('Id cannot be empty');
        return this.baseRequest(this.actions.setDelMark, {
          ...(forceDelete && {forceDelete: 1}),
          header: {id}
        })
      }
    }
  };
})();
