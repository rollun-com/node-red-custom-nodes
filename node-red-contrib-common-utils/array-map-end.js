module.exports = function (RED) {
  function ArrayMapEnd(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    this.config = RED.nodes.getNode(config.config);
    console.log('create node', node.send);

    let result = [];
    let timeouted = false;
    let timeout
    const timeoutTime = +config.timeout || 5000;

    const cleanUp = msg => {
      msg.value = undefined;
      msg.key = undefined;
      msg.array = undefined;
      msg.topic = undefined;
    }

    node.on('input', function (msg) {
      !timeout && (timeout = setTimeout(() => {
        msg.payload = {error: `Did not receive all items from array-map-start after ${timeoutTime}ms`};
        cleanUp(msg);
        node.send(msg);
        timeouted = true;
      }, timeoutTime));

      if (timeouted) return;

      if (msg.totalItemsAmount === undefined) {
        cleanUp(msg);
        msg.topic = 'Error. more info in msg.payload.';
        msg.payload = {error: 'It seems like, you accidentally deleted totalItemsAmount from message, do not do it please.'}
        node.send(msg);
      }

      result.push(msg.payload);
      // console.log('got element', msg.payload, result.length, msg.totalItemsAmount);
      if (result.length === msg.totalItemsAmount) {
        cleanUp(msg);
        msg.topic = `Iteration over, result can be found in msg.payload.`;
        msg.payload = result;
        node.send(msg);
        clearTimeout(timeout);
      }
    });
  }

  RED.nodes.registerType("array-map-end", ArrayMapEnd);
}
