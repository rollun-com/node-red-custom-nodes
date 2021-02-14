const {resolvePayload} = require('../node-red-contrib-common-utils/1-global-utils')
const {PartsUnlimitedAPI} = require('./pu-api');

module.exports = function (RED) {

  function PuApi(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.config = RED.nodes.getNode(config.config);

    node.on('input', async function (msg) {

      try {
        const api = new PartsUnlimitedAPI(node.config);

        if (!api[config.methodName]) {
          msg.payload = {error: `Unknown method [${config.methodName}] Orders API`};
          return node.send([msg, null]);
        }

        msg.payload = await api[config.methodName](resolvePayload(msg, config.requestPayload));
        return node.send([null, msg]);
      } catch (err) {
        if (!err.response) {
          msg.payload = {error: err.message || err.errno};
        } else {
          msg.payload = err.response.data;
          msg.status = err.response.status;
          msg.headers = err.response.headers;
        }
        return node.send(msg);
      }
    });
  }

  RED.nodes.registerType("parts-unlimited-orders", PuApi);
}
