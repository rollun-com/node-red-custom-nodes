module.exports = function (RED) {
  const url = require('url');

  global.tables = {
    datastore: class Datastore {

      /**
       * http methods
       * @type {{DELETE: string, POST: string, GET: string, PUT: string}}
       */

      METHODS = {
        GET: 'get',
        POST: 'post',
        PUT: 'put',
        DELETE: 'delete'
      };

      /**
       *
       * @type {string}
       */

      pathname = ''

      /**
       *
       * @param opts {{URL: string, timeout?: number}}
       * @param timeout {number?}
       */
      constructor({URL, timeout = 10000}) {
        if (!URL) throw new Error('Url is required.');
        const {protocol, host, pathname} = url.parse(URL);
        if (!host) throw new Error(`url is not in valid format! [${URL}]`);
        this.pathname = pathname;
        this.axios = require('axios').create({
          baseURL: `${protocol}://${host}`,
          timeout
        });
      }

      /**
       *
       * @param rql {string}
       * @param msg {*}
       */

      static resolveRQLWithREDMsg(rql, msg = {}) {
        return rql.trim()
          // remove trailing ?
          .replace(/^\?/, '')
          // resolve path
          .replace(/msg\.[a-zA-Z.]+/g, match => {
            const path = match.replace(/^msg\./, '');
            return global.tables.Datastore.encodeRQLValue(global.utils.resolvePath(msg, path));
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
          .catch(err => fullResponse ? err : {error: err.message, response: err.response});
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

      async get(_uri, _rql = '', fullResponse = false) {
        const rql = _rql.replace(/^\?/, '');
        return global.tables.datastore._withResponseFormatter(this.axios
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

      async getOne(_uri, _rql = '', fullResponse = false) {
        const rql = _rql.replace(/^\?/, '');
        return global.tables.datastore._withResponseFormatter(this.axios
            .get(`${this.pathname}${tables.Datastore._getUri(_uri)}?${rql}`)
            .then(({data}) => {
              switch (data.length) {
                case 0:
                  return null;
                case 1:
                  return data[0];
                default:
                  return null;
              }
            }),
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

      async post(_uri, body, fullResponse = false) {
        return global.tables.datastore._withResponseFormatter(this.axios
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

      async put(_uri, body, id, fullResponse = false) {
        return global.tables.datastore._withResponseFormatter(this.axios
            .put(`${this.pathname}${tables.Datastore._getUri(_uri)}/${id}`, body),
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
        return global.tables.datastore._withResponseFormatter(this.axios
            .delete(`${this.pathname}${tables.Datastore._getUri(_uri)}/${id}`),
          fullResponse
        );
      }
    }
  }
}
