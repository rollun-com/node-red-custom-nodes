const _ = require('lodash');

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

module.exports = {
  resolvePath,
  parseTypedInput,
  getTypedFieldValue,
  resolvePayload,
}
