module.exports = function (RED) {
  function WalmartAPI(config) {

    const WalmartAPIClient = require('./walmart-api-client');

    RED.nodes.createNode(this, config);
    const node = this;
    this.config = RED.nodes.getNode(config.config);


    node.on('input', function (msg) {
      const makeError = text => {
        msg.payload = {error: text};
        node.send([msg, null]);
      };

      if (!node.config) return makeError(`walmart config is required!`);

      const client = new WalmartAPIClient({
        ...node.config,
        correlationId: msg._msgid
      })

      if (!client[config.method]) return makeError(`invalid method name: ${config.method}`);


      // TODO refactor payload to be an object

      const payload = global.utils.getTypedFieldValue(msg, config.payload);

      client[config.method]({
        // TODO when payload wil be an object, just pass payload to method
        [config.method === 'getOrder' ? 'orderId' : 'createdStartDate']: payload
      })
        .then(result => {
          msg.payload = result;
          node.send(msg);
        })
        .catch(err => {
          msg.payload = {err: err.message};
          msg.response = {
            status: err.response && err.response.status ? err.response.status : undefined,
            data: err.response && err.response.data ? err.response.data : undefined
          }
          node.send(msg);
        })
    });
  }

  RED.nodes.registerType("walmart-api", WalmartAPI);
}
