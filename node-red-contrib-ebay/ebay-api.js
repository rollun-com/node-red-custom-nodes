module.exports = function (RED) {
  const _ = require('lodash');

  function EbayAPI(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.config = RED.nodes.getNode(config.config);

    node.on('input', function (msg) {
      const ebayAPI = new global.ebay.EbayAPI(node.config)

      const apiName = config.apiName;

      if (!ebayAPI[apiName]) {
        msg.payload = {error: `Unknown ebay API [${apiName}]`};
        return node.send([msg, null]);
      }

      const methodName = config.methodName;

      if (!ebayAPI[apiName][methodName]) {
        msg.payload = {error: `Unknown method in [${apiName}] API [${methodName}]`};
        return node.send([msg, null]);
      }

      const resolvePayload = (requestPayload) => {
        try {
          const parsedPayload = JSON.parse(requestPayload);
          const resolve = (acc, [key, value]) => {
            if (typeof value === 'string') {
              const resolvedValue = global.utils.getTypedFieldValue(msg, value);
              resolvedValue && acc.push([key, resolvedValue]);
              return acc;
            }
            const result = _.toPairs(value).reduce(resolve, []);
            _.size(result) > 0 && acc.push([key, _.fromPairs(result)])
            return acc;
          }
          return _.fromPairs(
            _.toPairs(parsedPayload)
              .reduce(resolve, [])
          )
        } catch (e) {
          return global.utils.getTypedFieldValue(msg, requestPayload)
        }
      }

      ebayAPI[apiName][methodName](resolvePayload(config.requestPayload))
        .then(({data, config: {url}}) => {
          msg.payload = data;
          msg.url = url;
          node.send([null, msg]);
        })
        .catch((err) => {
          if (!err.response) {
            msg.payload = {error: err.message || err.errno};
          } else {
            msg.payload = err.response.data;
            msg.status = err.response.status;
            msg.headers = err.response.headers;
          }
          node.send([null, msg]);
        })
    });
  }

  RED.nodes.registerType("ebay-api", EbayAPI);
}
