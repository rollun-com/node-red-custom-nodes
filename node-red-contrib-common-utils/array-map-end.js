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

    const addToResult = (value, msgid) => {
      if (!results[msgid]) results[msgid] = [];
      results[msgid].push(value);
    }

    const isFinished = (msgid, totalItemsCount) => {
      return results[msgid].length === totalItemsCount;
    }

    const getResult = (msgid) => {
      return results[msgid] || [];
    }

    const clearResult = (msgid) => {
      delete results[msgid];
    }

    node.on('input', function (msg) {

      !timeout && timeoutTime > 0 && (timeout = setTimeout(() => {
        if (msg.originalMsgDoNotTouch) {
          msg = msg.originalMsgDoNotTouch;
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
        if (msg.originalMsgDoNotTouch) {
          const req = msg.req;
          const res = msg.res;
          msg = msg.originalMsgDoNotTouch;
          msg.res = res;
          msg.req = req;
        }
        msg.topic = 'Error. more info in msg.payload.';
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

      addToResult(msg.payload, msg._msgid);
      if (isFinished(msg._msgid, msg.totalItemsAmount)) {
        try {
          const finalMsg = {
            ...(msg.originalMsgDoNotTouch || {}),
            topic: `Iteration over, result can be found in msg.payload.`,
            [resultField]: filterEmpty
              ? getResult(msg._msgid).filter(item => item !== null && item !== undefined)
              : getResult(msg._msgid),
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
