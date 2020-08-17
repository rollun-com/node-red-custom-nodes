module.exports = function (RED) {
  function CreateItem(config) {
    RED.nodes.createNode(this, config);

    this.config = RED.nodes.getNode(config.config);
    const node = this;

    node.on('input', function (msg) {

      const crypto = require('crypto');
      const docType = config.docType;
      const docData = JSON.parse(config.docData);

      const makeError = (text) => {

        msg.payload = {error: text};
        node.send([msg, null]);
      };

      if (!docType) return makeError(`docType is required!`);
      if (!docData) return makeError(`docData is required!`);
      if (!node.config) return makeError(`node.config is required!`);

      const header = Object
        .entries(docData)
        .reduce((acc, [key, val]) => {
          if (!val) return acc;
          const resolvedValue = global.utils.getTypedFieldValue(val, msg);
          if (resolvedValue) {
            acc[key] = resolvedValue;
          }
          return acc;
        }, {});
      const documentTableParts = msg.tableParts || null;

      console.log('table parts', documentTableParts);
      const client = new global.delovod.DelovodAPIClient(node.config);
      client
        .saveObject({
            ...header,
            // fields from msg header have more priority
            ...(msg.header || {}),
            id: docType,
            number: crypto.randomBytes(7).toString('base64').slice(0, 7),
          },
          documentTableParts
        )
        .then(result => {
          msg.payload = result;
          node.send([null, msg]);
        })
        .catch(err => {
          msg.payload = {error: err.message};
          node.send([msg, null])
        })
    })
  }

  RED.nodes.registerType("delovod-create-item", CreateItem);
}
