module.exports = function (RED) {
  function Test(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    console.log('create node', config);
    node.on('input', function (msg) {
      const axios = require('axios');
      const makeError = (node, text) => {
        msg.error = text;
        msg.payload = undefined;
        node.send(msg)
      };

      if (!config.url) return makeError(node, `url is required!`);

      const {rql = 'limit(20,0)', url} = config;

      const processedRql = rql.trim()
        // remove trailing ?
        .replace(/^\?/, '')
        // resolve path
        .replace(/msg\.[a-zA-Z.]+/g, match => {
          const path = match.replace(/^msg\./, '');
          return global.utils.resolvePath(msg, path)
        })

      const uri = `${url}?${processedRql}`;

      console.log('send request to ', uri);
      axios
        .get(uri, {timeout: 10000})
        .then(({data}) => {
          console.log('got result', data);
          msg.payload = data;
          data.error
            ? node.send([msg, null])
            : node.send([null, msg]);
        })
        .catch(err => {
          msg.payload = {
            error: err.message
          };
          if (err.response) {
            // cannot serialise response with request property due to circular properties
            err.response.request = null;
          }
          console.log('got error', err.response);
          msg.response = err.response;
          node.send([msg, null]);
        })
    });
  }

  RED.nodes.registerType("rollun-tables-get-items", Test);
}
