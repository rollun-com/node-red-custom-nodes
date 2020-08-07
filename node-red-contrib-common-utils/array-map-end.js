module.exports = function (RED) {
  function ArrayMapEnd(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    this.config = RED.nodes.getNode(config.config);

    let result = [];
    let timeouted = false;
    let timeout
    const timeoutTime = +config.timeout || 5000;

    node.on('input', function (msg) {
      !timeout && (timeout = setTimeout(() => {
        if (msg.originalMsgDoNotTouch) {
          msg = msg.originalMsgDoNotTouch;
        }        msg.payload = {error: `Did not receive all items from array-map-start after ${timeoutTime}ms`};
        node.send(msg);
        timeouted = true;
      }, timeoutTime));

      if (timeouted) return;

      if (msg._isArrayMapError === true || msg.totalItemsAmount === undefined) {
        if (msg.originalMsgDoNotTouch) {
          msg = msg.originalMsgDoNotTouch;
        }
        msg.topic = 'Error. more info in msg.payload.';
        if (!msg._isArrayMapError) {
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
          payload: result,
        }
        node.send(finalMsg);
        clearTimeout(timeout);
      }
    });
  }

  RED.nodes.registerType("array-map-end", ArrayMapEnd);
}
