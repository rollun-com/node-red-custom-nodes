const { getTypedFieldValue } = require('../node-red-contrib-common-utils/1-global-utils')
const { HttpDatastore } = require('./1-rollun-tables-utils');

module.exports = function (RED) {
  function DatastoreCRUD(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.on('input', function (msg) {
      const makeError = (node, text) => {
        msg.payload = { error: text };
        node.send([msg, null])
      };

      if (!config.url) return makeError(node, `url is required!`);
      if (!config.action) return makeError(node, `action is required!`);
      if (!config.payload) return makeError(node, `payload is required!`);
      if (!config.idField) return makeError(node, `idField is required!`);

      const { url, action, idField, timeout } = config;

      console.log(timeout)
      const datastore = new HttpDatastore({ URL: url, timeout, idField, msg });

      datastore[action]('', getTypedFieldValue(msg, config.payload))
        .then(result => {
          msg.payload = result;
          if (result && result.error) {
            node.send([msg, null]);
          } else {
            node.send([null, msg]);
          }
        })
        .catch(err => {
          msg.payload = { error: err.message };
          node.send([msg, null]);
        })
    });
  }

  RED.nodes.registerType("rollun-tables-crud", DatastoreCRUD);
}
