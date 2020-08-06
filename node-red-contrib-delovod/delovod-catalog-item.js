module.exports = function (RED) {
  function DelovodCatalogItem(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    this.config = RED.nodes.getNode(config.config);

    node.on('input', function (msg) {
      const axios = require('axios');

      const makeError = (node, text) => {
        msg.error = {error: text};
        msg.payload = undefined;
        node.send([msg, null])
      };

      console.log('incoming input', msg.payload);
      if (!node.config) return makeError(node, `node.config is required!`);
      if (!config.itemName) return makeError(node, `itemName is required!`);

      const [type, value] = global.utils.parseTypedInput(config.itemName);
      const itemName = type === 'msg'
        ? global.utils.resolvePath(msg, value)
        : value;
      const url = node.config.host;
      (async () => {
        const {data} = await axios.post(url, global.delovod.util.formatDelovodRequest({
            from: 'catalogs.goods',
            fields: {
              "id": "id",
              "name": "name"
            },
            filters: [{
              alias: "name", operator: "=", value: itemName
            }]
          },
          global.delovod.actions.REQUEST,
          {...node.config}
        ))
        console.log('get result', data)
        if (data.error) throw new Error(data.error);
        if (data.length > 0) {
          msg.topic = `Found item in catalog, using it.`;
          msg.payload = data[0];
          return node.send([null, msg]);
        }
        const {data: newItem} = await axios.post(url, global.delovod.util.formatDelovodRequest({
          header: {
            id: 'catalogs.goods',
            name: itemName
          }
        }, global.delovod.actions.SAVE_OBJECT, {...node.config}))
        msg.topic = `Item with name ${itemName} not found, creating new one`;
        msg.payload = newItem;
        node.send([null, msg]);
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

  RED.nodes.registerType("delovod-catalog-item", DelovodCatalogItem);
}
