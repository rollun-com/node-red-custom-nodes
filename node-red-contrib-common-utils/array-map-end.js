module.exports = function (RED) {
  function ArrayMapEnd(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    this.config = RED.nodes.getNode(config.config);

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

    const clearResult = (msgid) => {
      delete results[msgid];
    }

    node.on('input', function (msg) {

      !timeout && timeoutTime > 0 && (timeout = setTimeout(() => {
        if (msg.originalMsg) {
          msg = msg.originalMsg;
        }
        clearResult(msg._msgid);
        msg.payload = {error: `Did not receive all items from array-map-start after ${timeoutTime}ms`};
        node.send(msg);
        timeouted = true;
      }, timeoutTime));

      if (timeouted) return;

      if (msg._isArrayMapError === true || msg.totalItemsAmount === undefined) {
        const orgError = msg.error || 'Unknown error';
        clearResult(msg._msgid);
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
          clearResult(msg._msgid);
          node.send(finalMsg);
          clearTimeout(timeout);
        } catch (e) {
          console.log('cannot send result msg after map', e);
        }
      }
    });
  }

  RED.nodes.registerType("array-map-end", ArrayMapEnd);
}
