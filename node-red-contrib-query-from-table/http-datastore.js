const url = require('url');

const { resolvePath } = require('../node-red-contrib-common-utils/1-global-utils');

class HttpDatastore {

  /**
   *
   * @param opts {{URL: string, timeout?: number}}
   * @param timeout {number?}
   */
  constructor({ URL, idField = 'id', timeout = 10000, msg = {} }) {
    if (!URL) throw new Error('Url is required.');
    const { protocol, host, pathname } = url.parse(URL);
    if (!host) throw new Error(`url is not in valid format! [${URL}]`);

    /** @type {import('rollun-ts-rql').RqlParser} */
    this.rqlParser = new RqlParser();

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
      baseURL: `${protocol}//103185124773711762898:WeakwPE7jLZz@${host}`,
      timeout,
      headers: {
        'content-type': 'application/json',
      }
    });
  }

  /**
   *
   * @param rql {string}
   * @returns {import('rollun-ts-rql').Query | string}
   */

  parseRql(rql) {
    if (rql === '') {
      return '';
    }
    return HttpDatastore.resolveRQLWithREDMsg(rql, this.msg);
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
        return HttpDatastore.encodeRQLValue(resolvePath(msg, path));
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
   * @param uri
   * @param rql
   * @param fullResponse
   * @return {Promise<[]*>}
   */

  async query(uri, rql = '', fullResponse = false) {
    return HttpDatastore._withResponseFormatter(this.axios
        .get(`${this.pathname}${HttpDatastore._getUri(uri)}?${this.parseRql(rql)}`),
      fullResponse
    );
  }

  /**
   *
   * @param uri
   * @param rql
   * @param fullResponse
   * @return {Promise<[]*>}
   */

  async getFirst(uri, rql = '', fullResponse = false) {
    return HttpDatastore._withResponseFormatter(this.axios
        .get(`${this.pathname}${HttpDatastore._getUri(uri)}?${this.parseRql(rql)}`)
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

  async read(uri, id, fullResponse = false) {
    return HttpDatastore._withResponseFormatter(this.axios
        .get(`${this.pathname}${HttpDatastore._getUri(uri)}/${encodeURI(id)}`),
      fullResponse
    );
  }


  /**
   *
   * @param uri
   * @param body {string | object | [] | number | boolean}
   * @param fullResponse
   * @return {Promise<*>}
   */

  async create(uri, body, fullResponse = false) {
    return HttpDatastore._withResponseFormatter(this.axios
        .post(`${this.pathname}${HttpDatastore._getUri(uri)}`, body),
      fullResponse
    );
  }

  /**
   *
   * @param uri
   * @param body {string | object | [] | number | boolean}
   * @param fullResponse
   * @return {Promise<*>}
   */

  async update(uri, body, fullResponse = false) {
    const id = body[this.idField];
    if (!id) {
      throw new Error(`Id field with name [${this.idField}] is empty or does not exist in body!`);
    }
    return HttpDatastore._withResponseFormatter(this.axios
        .put(`${this.pathname}${HttpDatastore._getUri(uri)}`, body),
      fullResponse
    );
  }

  /**
   *
   * @param uri
   * @param id {string}
   * @param fullResponse
   * @return {Promise<*>}
   */

  async delete(uri, id, fullResponse = false) {
    return HttpDatastore._withResponseFormatter(this.axios
        .delete(`${this.pathname}${HttpDatastore._getUri(uri)}/${id}`),
      fullResponse
    );
  }
}

module.exports = { HttpDatastore };