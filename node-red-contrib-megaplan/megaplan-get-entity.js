module.exports = function (RED) {
  function MegaplanGetEntity(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    this.config = RED.nodes.getNode(config.config);
    console.log('create node', config, this.config);

    node.on('input', function (msg) {
      const axios = require('axios');

      const makeError = (node, text) => {
        msg.error = {error: text};
        msg.payload = undefined;
        node.send(msg)
      };

      console.log('incoming input', msg.payload);
      node.send([null, msg]);
    });
  }

  RED.nodes.registerType("megaplan-get-entity", MegaplanGetEntity);
}
