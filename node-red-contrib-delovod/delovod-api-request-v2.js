module.exports = function (RED) {
  function DelovodQuery(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    this.config = RED.nodes.getNode(config.config);

    node.on('input', function (msg) {
      const makeError = (node, text) => {
        msg.payload = {error: text};
        node.send([msg, null])
      };

      if (!node.config) return makeError(node, `node.config is required!`);
      if (!config['action']) return makeError(node, `action is required!`);

      new global.delovod.DelovodAPIClient(node.config)
        .baseRequest(config['action'], msg.payload)
        .then(res => {
          msg.payload = res || null
          node.send([null, msg]);
        })
        .catch(err => {
          msg.payload = {error: err.message}
          if (err.response) {
            // cannot serialise response with request property due to circular properties
            err.response.request = null;
            msg.raw_response = err.response;
          }
          node.send([msg, null]);
        })
    });
  }

  RED.nodes.registerType("delovod-api-request-v2", DelovodQuery);
}
