const _ = require('lodash');
const { randomString } = require('rollun-ts-utils');

/**
 *
 * @return {*}
 * @param obj
 * @param path
 */
function resolvePath(obj, path) {
  path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  path = path.replace(/^\./, '');           // strip a leading dot
  var a = path.split('.');
  for (var i = 0, n = a.length; i < n; ++i) {
    var k = a[i];
    if (typeof obj === 'object' && k in obj) {
      obj = obj[k];
    } else {
      return;
    }
  }
  return obj;
}

/**
 *
 * @param val - input like str|12313, where str is type and 12313 is value.
 * @returns {string[]} - where first is type and second is value.
 */
function parseTypedInput(val) {
  if (!val) {
    return ['unknown'];
  }
  const [type = '', ...value] = val.split('|');
  // if value contains '|'
  return [type, value.join('|')];
}

/**
 * get values from typed input
 * @param val - pair of type, value connected with |, example: msg|payload, const|12345
 * @param msg - msg
 * @return {string|*}
 */

function getTypedFieldValue(msg, val = '') {
  if (!val) return '';
  const [type, value] = parseTypedInput(val);
  if (type === 'msg') {
    return resolvePath(msg, value);
  }
  // if (type === 'json') {
  //   return JSON.parse(val);
  // }
  return value;
}

/**
 *
 * Function expects object with values from typed input, example:
 *  obj = {
 *         field: "msg|payload"
 *      }
 *  And returns resolved object against msg. For example with given msg -
 *  msg = {
 *    payload: 'value'
 *  }
 *
 *  call resolvePayload({obj}) will return
 *  {
 *      field: 'value'
 *  }
 *
 * @param msg {object}
 * @param requestPayload {object|string}
 */

function resolvePayload(msg, requestPayload) {
  try {
    const parsedPayload = typeof requestPayload === "string"
      ? JSON.parse(requestPayload)
      : requestPayload;
    const resolve = (acc, [key, value]) => {
      if (typeof value === 'string') {
        const resolvedValue = getTypedFieldValue(msg, value);
        resolvedValue && acc.push([key, resolvedValue]);
        return acc;
      }
      const result = _.toPairs(value).reduce(resolve, []);
      _.size(result) > 0 && acc.push([key, _.fromPairs(result)])
      return acc;
    }
    return _.fromPairs(
      _.toPairs(parsedPayload)
        .reduce(resolve, [])
    )
  } catch (e) {
    return getTypedFieldValue(msg, requestPayload)
  }
}

function wait(duration = 1000) {
  if (duration < 0) {
    throw new TypeError(`duration cannot be below 0, got ${duration}`)
  }
  return new Promise(resolve => setTimeout(resolve, 1000));
}

/**
 * function will generate new LT and return in, also it will try to retrieve parent LT from request
 * @param msg
 * @return {{LT: string, PLT: string}}
 */

function getLifecycleToken(msg = {}) {
  const { req, __parent_lifecycle_token, __lifecycle_token } = msg;
  console.log('getLifecycleToken', msg);
  return {
    PLT: __parent_lifecycle_token || (req && req.__parent_lifecycle_token) || (req ? req.header('lifecycle_token') || req.header('lifecycletoken') || null : null),
    LT: __lifecycle_token || req.__lifecycle_token || randomString(30, 'QWERTYUIOPASDFGHJKLZXCVBNM0123456789'),
  }
}

class UDPClient {
  constructor(host, port) {
    this._client = require('dgram').createSocket('udp4');
    this.host = host;
    this.port = port;
  }

  static _encodeData(data) {
    const encodedDataString = typeof data === 'string'
      ? data
      : JSON.stringify(data);
    return Buffer.from(encodedDataString);
  }

  send(data, cb = () => {
  }) {
    if (cb) {
      this._client.send(
        UDPClient._encodeData(data),
        this.port,
        this.host,
        cb
      )
    } else {
      return new Promise((resolve, reject) => {
        this._client.send(
          UDPClient._encodeData(data),
          this.port,
          this.host,
          error => error ? reject(error) : resolve()
        )
      });
    }
  };

  destroy() {
    this._client.disconnect();
  }
}

class ElasticLogger {
  constructor(opts) {
    this.index_name = opts.index_name;
    this.lifecycle_token = opts.lifecycle_token;
    this.parent_lifecycle_token = opts.parent_lifecycle_token;
    this.udp_client = new UDPClient(opts.host, opts.port);
  }

  async _logProduction(log_level, message, context, lifecycle_token, parent_lifecycle_token) {

    try {
      const log = {
        index_name: this.index_name,
        level: log_level,
        message,
        context: context ? JSON.stringify(context) : null,
        '@timestamp': (new Date()).toISOString(),
        lifecycle_token: this.lifecycle_token || lifecycle_token || null,
        parent_lifecycle_token: this.parent_lifecycle_token || parent_lifecycle_token || null
      };
      console.log(log);
      await this.udp_client.send(log);
    } catch (err) {
      console.error(`Couldn't log [${message}] message`, err, err.meta);
    }
  }

  async log(log_level, message, context, lifecycle_token, parent_lifecycle_token) {
    return this._logProduction(log_level, message, context, lifecycle_token, parent_lifecycle_token);
  }

  destroy() {
    this.udp_client.destroy();
  }
}

const defaultLogger = new ElasticLogger({
  index_name: process.env.SERVICE_NAME || 'default_node_red_log',
  host: 'logstash',
  port: '5044',
});

module.exports = {
  defaultLogger,
  ElasticLogger,
  resolvePath,
  parseTypedInput,
  getTypedFieldValue,
  resolvePayload,
  wait,
  getLifecycleToken,
}
