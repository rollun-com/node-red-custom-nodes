module.exports = function (RED) {
  function ArrayMapEnd(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    this.config = RED.nodes.getNode(config.config);

    let result = [];
    let timeouted = false;
    let timeout
    const timeoutTime = +config.timeout || 5000;
    const filterEmpty = !!config.filterEmpty;
    const [, resultField] = (config.resultField || 'msg|payload').split('|');

    node.on('input', function (msg) {
      !timeout && timeoutTime > 0 && (timeout = setTimeout(() => {
        if (msg.originalMsgDoNotTouch) {
          msg = msg.originalMsgDoNotTouch;
        }
        msg.payload = {error: `Did not receive all items from array-map-start after ${timeoutTime}ms`};
        node.send(msg);
        timeouted = true;
      }, timeoutTime));

      if (timeouted) return;

      if (msg._isArrayMapError === true || msg.totalItemsAmount === undefined) {
        const orgError = msg.error || 'Unknown error';
        if (msg.originalMsgDoNotTouch) {
          const req = msg.req;
          const res = msg.res;
          msg = msg.originalMsgDoNotTouch;
          msg.req = req;
          msg.res = res;
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

      result.push(msg.payload);
      if (result.length === msg.totalItemsAmount) {
        const finalMsg = {
          ...(msg.originalMsgDoNotTouch || {}),
          topic: `Iteration over, result can be found in msg.payload.`,
          [resultField]: filterEmpty
            ? result.filter(item => item !== null && item !== undefined)
            : result,
        }
        node.send(finalMsg);
        clearTimeout(timeout);
      }
    });
  }

  RED.nodes.registerType("array-map-end", ArrayMapEnd);
}
