module.exports = function (RED) {
  function DelovodPostDocument(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    this.config = RED.nodes.getNode(config.config);

    node.on('input', function (msg) {

      const makeError = (node, text) => {
        msg.error = {error: text};
        msg.payload = undefined;
        node.send([msg, null])
      };

      if (!node.config) return makeError(node, `node.config is required!`);
      if (!config.docId) return makeError(node, `docId is required!`);

      const docId = global.utils.getTypedFieldValue(config.docId, msg);

      (new global.delovod.DelovodAPIClient(node.config))
        .saveObject({
          id: docId,
        }, null, 'REGISTER')
        .then(result => {
          msg.payload = result;
          node.send([null, msg]);
        })
        .catch(err => {
          msg.payload = {error: err.message}
          node.send([msg, null]);
        });
    });
  }

  RED.nodes.registerType("delovod-post-document", DelovodPostDocument);
}
