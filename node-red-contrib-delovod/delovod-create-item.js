module.exports = function (RED) {
  function CreateItem(config) {
    RED.nodes.createNode(this, config);

    this.config = RED.nodes.getNode(config.config);
    const node = this;

    node.on('input', function (msg) {
      console.log('got request', config, node.config);
      const axios = require('axios');
      const docType = config.docType;
      const docData = JSON.parse(config.docData);

      const makeError = (text) => {
        console.log('ERROR', text);
        msg.payload = {error: text};
        node.send([msg, null]);
      };

      if (!docType) return makeError(`docType is required!`);
      if (!docData) return makeError(`docData is required!`);
      if (!node.config) return makeError(`node.config is required!`);

      const header = Object
        .entries(docData)
        .reduce((acc, [key, val]) => {
          // values from msg.header have more priority
          if ((msg.header || {})[key]) {
            acc[key] = msg.header[key];
            return acc;
          }
          if (!val) return acc;
          const [type, value] = val.split('|');
          acc[key] = type === 'msg' ? global.delovod.util.resolvePath(msg, value) : value
          return acc;
        }, {});
      const documentTableParts = msg.tableParts || {};
      const document = {
        header: header,
        tableParts: documentTableParts
      }
      msg.payload = document;
      axios.post(
        node.config.host,
        global.delovod.util.formatDelovodRequest(document, global.delovod.actions.SAVE_OBJECT, {...node.config}),
        {
          timeout: 10000,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }
      )
        .then(({data}) => {
          msg.payload = data
          data.error ? node.send([msg, null]) : node.send([null, msg])
        })
        .catch(err => {
          console.log(err);
          msg.payload = {error: err.message};
          node.send([null, msg])
        })
    })
  }

  RED.nodes.registerType("delovod-create-item", CreateItem);
}
