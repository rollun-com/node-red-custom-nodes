module.exports = function (RED) {
  function DelovodCatalogItem(config) {
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
      if (!config.itemName) return makeError(node, `itemName is required!`);

      const [type, value] = global.utils.parseTypedInput(config.itemName);
      const itemName = type === 'msg'
        ? global.utils.resolvePath(msg, value)
        : value;
      const client = new global.delovod.DelovodAPIClient(node.config);
      (async () => {
        const items = await client.request('catalogs.goods', [{
          alias: "name", operator: "=", value: itemName
        }]);
        msg.items = items;
        if (items.length > 1) {
          msg.topic = `Found 2 or more goods by filter.`;
          msg.payload = {error: `Found 2 or more goods by filter.`};
          return node.send([msg, null]);
        }

        if (items.length === 1) {
          msg.topic = `Found good in catalog, using it.`;
          msg.payload = items[0];
          return node.send([null, msg]);
        }

        if (config.createIfNotFound === true) {
          msg.topic = `Created good`
          msg.payload = await client.saveObject({
            id: 'catalogs.goods',
            name: itemName
          });
          return node.send([null, msg]);
        } else {
          msg.payload = {error: 'No goods found by filter!'};
          return node.send([msg, null]);
        }
      })()
        .catch(err => {
          console.log(err);
          msg.payload = {
            error: err.message
          }
          node.send([msg, null]);
        })
    });
  }

  RED.nodes.registerType("delovod-catalog-good", DelovodCatalogItem);
}
