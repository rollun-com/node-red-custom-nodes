module.exports = function (RED) {

  let continuePipelineIfIterableIsEmpty = null;

  function ArrayMapStart(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    this.config = RED.nodes.getNode(config.config);

    node.on('input', function (msg) {
      const _ = require('lodash');

      const makeError = (node, text) => {
        msg.error = {error: text};
        msg.payload = undefined;
        node.send(msg)
      };

      const interval = +config.interval;

      if (!config.arrayField) return makeError(node, `arrayField is required!`);
      if (isNaN(interval) || interval < 0) return makeError(node, `interval is required, and must be a number > 0!`);


      (async () => {
        let iterable = global.utils.getTypedFieldValue(msg, config.arrayField);

        if (typeof iterable !== 'object') {
          throw new Error('Data in arrayField must be either object or array!');
        }

        const type = Array.isArray(iterable) ? 'array' : 'object';

        if (type === 'object') {
          iterable = Object.entries(iterable);
        }

        if (iterable.length === 0) {
          return continuePipelineIfIterableIsEmpty(msg);
        }

        const {req, res} = msg;

        if (req) delete msg.req;
        if (res) delete msg.res;

        for (let i = 0, len = iterable.length; i < len; i++) {
          let key, value, index;
          if (type === 'array') {
            index = i;
            value = iterable[i];
          }

          if (type === 'object') {
            [key, value] = iterable[i];
          }

          const msgCopy = {
            _msgid: msg._msgid,
            payload: _.cloneDeep(value),
            type,
            ...(index !== undefined && {index: i}),
            ...(key !== undefined && {key}),
            totalItemsAmount: len,
            topic: `Element #${i} of iterable`,
            originalMsg: msg,
            req: req,
            res: res
          };

          node.send(msgCopy);

          await (new Promise(resolve => setTimeout(() => resolve(), +config.interval)));
        }

      })()
        .catch(err => {
          console.log(err);
          msg._isArrayMapError = true;
          msg.error = err.message;
          node.send(msg)
        })
    });
  }

  RED.nodes.registerType("array-map-start", ArrayMapStart);

  function ArrayMapEnd(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    this.config = RED.nodes.getNode(config.config);

    continuePipelineIfIterableIsEmpty = msg => node.send(msg);

    // map _msgif -> array of results
    let results = {};
    let timeouted = false;
    let timeout
    const timeoutTime = +config.timeout || 5000;
    const filterEmpty = !!config.filterEmpty;
    const [, resultField] = (config.resultField || 'msg|payload').split('|');

    const addToResult = ({payload, _msgid, type, key}) => {
      if (!results[_msgid]) {
        results[_msgid] = type === 'array' ? [] : {};
      }
      if (type === 'array') {
        results[_msgid].push(payload);
      } else {
        if (key === null || key === undefined || key === '') {
          key = RED.util.generateId()
        }
        results[_msgid][key] = payload;
      }
    }

    const isFinished = ({_msgid, totalItemsAmount, type}) => {
      if (type === 'array') {
        return results[_msgid].length === totalItemsAmount
      }
      return Object.keys(results[_msgid]).length === totalItemsAmount;
    }

    const getResult = ({_msgid, type}, filterEmpty = false) => {
      const toDel = (val) => val !== null && val !== undefined;
      if (type === 'array') {
        const arr = results[_msgid] || [];
        return filterEmpty
          ? arr.filter(toDel)
          : arr
      }
      if (type === 'object') {
        const obj = results[_msgid] || {};
        return filterEmpty
          ? Object.entries(obj)
            .filter(([, val]) => toDel(val))
            .reduce((acc, [key, value]) => {
              acc[key] = value;
              return acc;
            }, {})
          : obj
      }
    }

    const clearResult = ({_msgid}) => {
      if (results[_msgid]) {
        delete results[_msgid];
      }
    }

    node.on('input', function (msg) {

      !timeout && timeoutTime > 0 && (timeout = setTimeout(() => {
        if (msg.originalMsg) {
          msg = msg.originalMsg;
        }
        clearResult(msg);
        msg.payload = {error: `Did not receive all items from array-map-start after ${timeoutTime}ms`};
        node.send(msg);
        timeouted = true;
      }, timeoutTime));

      if (timeouted) return;

      if (msg._isArrayMapError === true || msg.totalItemsAmount === undefined) {
        const orgError = msg.error || 'Unknown error';
        clearResult(msg);
        if (msg.originalMsg) {
          const req = msg.req;
          const res = msg.res;
          msg = msg.originalMsg;
          msg.res = res;
          msg.req = req;
        }
        if (msg._isArrayMapError) {
          msg.payload = {
            error: orgError
          }
        } else {
          msg.payload = {
            error: 'It seems like, you accidentally deleted totalItemsAmount from message, do not do it please.'
          }
        }
        node.send(msg);
      }

      addToResult(msg);
      if (isFinished(msg)) {
        try {
          const finalMsg = {
            ...(msg.originalMsg || {}),
            [resultField]: getResult(msg, filterEmpty),
            req: msg.req,
            res: msg.res
          }
          clearResult(msg);
          node.send(finalMsg);
          clearTimeout(timeout);
        } catch (e) {
          console.log('cannot send result msg after map', e);
        }
      }
    });
  }

  RED.nodes.registerType("array-map-end", ArrayMapEnd);

};
