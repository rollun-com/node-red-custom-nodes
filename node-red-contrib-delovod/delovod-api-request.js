module.exports = function (RED) {
  function DelovodQuery(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    this.config = RED.nodes.getNode(config.config);
    console.log('create node', config, this.config);

    node.on('input', function (msg) {
      const axios = require('axios');

      const makeError = (node, text) => {
        msg.error = {error: text};
        msg.payload = undefined;
        node.send(msg)
      };

      console.log('incoming input', msg.payload);
      if (!node.config) return makeError(node, `node.config is required!`);
      if (!config['action']) return makeError(node, `action is required!`);

      const action = config['action'];
      // clear payload to prevent side effects
      const payload = msg.payload;
      msg.payload = undefined;

      const url = node.config.host;
      console.log('send request to ', url);
      axios
        .post(url, `packet=${JSON.stringify({
          version: node.config.version,
          key: node.config.key,
          action: action,
          params: payload
        })}`, {
          timeout: 10000,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .then(({data}) => {
          console.log('got result', data);
          msg.payload = data
          node.send(msg);
        })
        .catch(err => {
          console.log('got error', err);
          msg.payload = {error: err.message}
          if (err.response) {
            // cannot serialise response with request property due to circular properties
            err.response.request = null;
          }
          msg.response = err.response;
          node.send(msg);
        })
    });
  }

  RED.nodes.registerType("delovod-api-request", DelovodQuery);
}
