const {resolvePath} = require('../node-red-contrib-common-utils/1-global-utils');

module.exports = (function (RED) {
  const url = require('url');

  global.tables = {
    Datastore: class Datastore {

      /**
       *
       * @param opts {{URL: string, timeout?: number}}
       * @param timeout {number?}
       */
      constructor({URL, idField = 'id', timeout = 10000, msg = {}}) {
        if (!URL) throw new Error('Url is required.');
        const {protocol, host, pathname} = url.parse(URL);
        if (!host) throw new Error(`url is not in valid format! [${URL}]`);

        /**
         * MSG object, used to resolve variables in RQL string using Datastore.resolveRQLWithREDMsg
         * @type {object}
         */

        this.msg = msg;

        /**
         * @type {string}
         */

        this.idField = idField;

        /**
         * @type {string}
         */

        this.pathname = pathname || '';

        /**
         * @type {AxiosInstance}
         */

        this.axios = require('axios').create({
          baseURL: `${protocol}//${host}`,
          timeout
        });
      }


      /**
       * example:
       *     if string contains path relative to msg (e.g. msg.rlln.mp.order.id), with given args
       *      rql = select(id)&limit(20,0)&like(mp_order_id,string:msg.rlln.mp.order.id)
       *      msg = {rlln: {mp: {order: "123456"}}}
       *     will be resolved to
       *     select(id)&limit(20,0)&like(mp_order_id,string:123456)
       * @param rql {string}
       * @param msg {*}
       */

      static resolveRQLWithREDMsg(rql, msg = {}) {
        return rql.trim()
          // remove trailing ?
          .replace(/^\?/, '')
          // resolve path
          .replace(/msg\.[a-zA-Z0-9.]+/g, match => {
            const path = match.replace(/^msg\./, '');
            return global.tables.Datastore.encodeRQLValue(resolvePath(msg, path));
          })
      }

      /**
       *
       * @param value {string}
       */

      static encodeRQLValue(value) {
        let encodedValue = encodeURIComponent(value);
        while (encodedValue.match(/[()\-_.~!*']/g)) {
          encodedValue = encodedValue
            .replace('(', '%28')
            .replace(')', '%29')
            .replace('-', '%2D')
            .replace('_', '%5F')
            .replace('.', '%2E')
            .replace('~', '%7E')
            .replace('*', '%2A')
            .replace('\'', '%27')
            .replace('!', '%21');
        }
        return encodedValue;
      }

      /**
       *
       * @param promise {Promise<*>}
       * @param fullResponse {boolean}
       * @private
       * @return {Promise<*>}
       */

      static _withResponseFormatter(promise, fullResponse = false) {
        return promise
          .then(res => {
            if (res.error) throw new Error(res.error);
            return fullResponse ? res : res.data
          })
          // rethrow error, with different message, if key error exists in response
          .catch(err => {
            if (err.response && err.response.data) {
              if (err.response.data.error) {
                throw new Error(err.response.data.error);
              }
              throw new Error(JSON.stringify(err.response.data));
            }
            throw err;
          });
      }

      /**
       * returns path without trailing slash and adds start slash
       * @param uri
       * @return {string}
       * @private
       */

      static _getUri(uri) {
        if (!uri) return '';
        return `/${uri
          .replace(/^\//, '')
          .replace(/\/$/, '')}`;
      }

      /**
       *
       * @param _uri
       * @param _rql
       * @param fullResponse
       * @return {Promise<[]*>}
       */

      async query(_uri, _rql = '', fullResponse = false) {
        const rql = global.tables.Datastore.resolveRQLWithREDMsg(_rql, this.msg);

        return global.tables.Datastore._withResponseFormatter(this.axios
            .get(`${this.pathname}${tables.Datastore._getUri(_uri)}?${rql}`),
          fullResponse
        );
      }

      /**
       *
       * @param _uri
       * @param _rql
       * @param fullResponse
       * @return {Promise<[]*>}
       */

      async getFirst(_uri, _rql = '', fullResponse = false) {
        const rql = global.tables.Datastore.resolveRQLWithREDMsg(_rql, this.msg);
        return global.tables.Datastore._withResponseFormatter(this.axios
            .get(`${this.pathname}${tables.Datastore._getUri(_uri)}?${rql}`)
            .then(result => {
              if (result.data && result.data.length > 0) {
                result.data = result.data[0];
              } else {
                result.data = null;
              }
              return result;
            }),
          fullResponse
        );
      }

      async read(_uri, id, fullResponse = false) {
        return global.tables.Datastore._withResponseFormatter(this.axios
            .get(`${this.pathname}${tables.Datastore._getUri(_uri)}/${encodeURI(id)}`),
          fullResponse
        );
      }


      /**
       *
       * @param _uri
       * @param body {string | object | [] | number | boolean}
       * @param fullResponse
       * @return {Promise<*>}
       */

      async create(_uri, body, fullResponse = false) {
        return global.tables.Datastore._withResponseFormatter(this.axios
            .post(`${this.pathname}${tables.Datastore._getUri(_uri)}`, body),
          fullResponse
        );
      }

      /**
       *
       * @param _uri
       * @param body {string | object | [] | number | boolean}
       * @param id {string | number}
       * @param fullResponse
       * @return {Promise<*>}
       */

      async update(_uri, body, fullResponse = false) {
        return global.tables.Datastore._withResponseFormatter(this.axios
            .put(`${this.pathname}${tables.Datastore._getUri(_uri)}/${body[this.idField]}`, body),
          fullResponse
        );
      }

      /**
       *
       * @param _uri
       * @param id {string}
       * @param fullResponse
       * @return {Promise<*>}
       */

      async delete(_uri, id, fullResponse = false) {
        return global.tables.Datastore._withResponseFormatter(this.axios
            .delete(`${this.pathname}${tables.Datastore._getUri(_uri)}/${id}`),
          fullResponse
        );
      }
    }
  }

})();
