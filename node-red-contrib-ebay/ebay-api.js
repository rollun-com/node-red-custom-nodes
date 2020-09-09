module.exports = function (RED) {
  function EbayAPI(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.config = RED.nodes.getNode(config.config);

    node.on('input', function (msg) {
      const ebayAPI = new global.ebay.EbayAPI(node.config)

      ebayAPI.sell.getOrder('25-05703-28634')
        .then(({data}) => {
          console.log('result', data);
        })
        .catch((err) => {
          console.log('error', err.response.data, err.response.status, err.response.statusText);
        })
      node.send(msg);
    });
  }

  RED.nodes.registerType("ebay-api", EbayAPI);
}
