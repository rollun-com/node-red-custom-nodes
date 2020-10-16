const {getTypedFieldValue} = require('../node-red-contrib-common-utils/1-global-utils')

const crypto = require('crypto');

module.exports = function (RED) {
  function CreateItem(config) {
    RED.nodes.createNode(this, config);

    this.config = RED.nodes.getNode(config.config);
    const node = this;

    node.on('input', function (msg) {

      const docType = config.docType;
      const docData = JSON.parse(config.docData);
      const docId = getTypedFieldValue(msg, config.docId);

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
          const resolvedValue = getTypedFieldValue(msg, val);
          if (resolvedValue) {
            acc[key] = resolvedValue;
          }
          return acc;
        }, {});
      const documentTableParts = msg.tableParts;

      const resultHeader = {
        ...header,
        // fields from msg header have more priority
        ...(msg.header || {}),
        // use doc it to update doc, if passed, and doc type, to create new document
        id: docId || docType,
        number: crypto.randomBytes(7).toString('base64').slice(0, 7),
      }

      const client = new global.delovod.DelovodAPIClient(node.config);
      client
        .saveObject(resultHeader, documentTableParts)
        .then(result => {
          msg.payload = result;
          node.send([null, msg]);
        })
        .catch(err => {
          msg.payload = {error: err.message};
          msg.sentPayload = {
            header: resultHeader,
            tableParts: documentTableParts
          }
          node.send([msg, null])
        })
    })
  }

  RED.nodes.registerType("delovod-create-item", CreateItem);
}
