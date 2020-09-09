module.exports = function (RED) {
  function EbayAPI(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.config = RED.nodes.getNode(config.config);

    node.on('input', function (msg) {
      const ebayAPI = new global.ebay.EbayAPI(node.config)

      console.log('test');

      node.send(msg);
    });
  }

  RED.nodes.registerType("ebay-api", EbayAPI);
}
