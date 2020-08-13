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

      const itemName = global.utils.getTypedFieldValue(config.itemName, msg);
      const goodChar = global.utils.getTypedFieldValue(config.goodChar, msg);

      const client = new global.delovod.DelovodAPIClient(node.config);
      (async () => {
        const items = await client.request(
          'catalogs.goods',
          [{alias: "name", operator: "=", value: itemName}]
        );
        if (items.length > 1) {
          msg.payload = {error: `Found 2 or more goods by name - ${itemName}.`};
          return node.send([msg, null]);
        }

        let resultTopic = '';
        let good

        if (items.length === 1) {
          const {id} = items[0];
          good = {id: id};
          resultTopic += `Good found - ${id}. `;
        }

        if (items.length === 0) {
          if (config.createGoodIfNotFound === true) {
            const {id} = await client.saveObject({
              id: 'catalogs.goods',
              name: itemName
            });
            resultTopic += `Good created - ${id}. `
            good = {id};
          } else {
            msg.payload = {error: `Item (${itemName}) not found.`};
            return node.send([msg, null]);
          }
        }

        if (!goodChar) {
          // no goodChar needed
          msg.topic = resultTopic;
          msg.payload = good;
          return node.send([null, msg]);
        }

        // will be changed to catalogs.techCards
        let goodChars = await client.request('catalogs.goodChars', [
          {alias: "owner", operator: "=", value: good.id}
        ]);
        // filter manually, delovod api does not filter by name...
        goodChars = goodChars.filter(char => char.id__pr === goodChar);
        if (goodChars.length >= 1) {
          const {id} = goodChars[0];
          resultTopic += `goodChar found - ${id}. `;
          good.goodChar = id;
          msg.payload = good;
          msg.topic = resultTopic;
          return node.send([null, msg]);
        }

        if (goodChars.length === 0) {
          if (config.createGoodCharIfNotFound === true) {
            const {id} = await client.saveObject({
              id: 'catalogs.goodChars',
              name: goodChar,
              owner: good.id
            });
            resultTopic += `Created goodChar - ${id}. `;
            good.goodChar = id;
            msg.topic = resultTopic;
            msg.payload = good;
            return node.send([null, msg]);
          } else {
            msg.payload = {error: `No goodChar found by owner ${good.id} and name ${goodChar}`};
            return node.send([msg, null]);
          }
        }
      })()
        .catch(err => {

          msg.payload = {
            error: err.message
          }
          node.send([msg, null]);
        })
    });
  }

  RED.nodes.registerType("delovod-catalog-good", DelovodCatalogItem);
}
