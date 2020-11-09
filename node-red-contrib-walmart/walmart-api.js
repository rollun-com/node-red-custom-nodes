const {getTypedFieldValue} = require('../node-red-contrib-common-utils/1-global-utils')
const WalmartAPIClient = require('./walmart-api-client');
const _ = require('lodash');

module.exports = function (RED) {
  function WalmartAPI(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    this.config = RED.nodes.getNode(config.config);


    // TODO move this logic to common module for ebay and walmart
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

      if (!client[config.apiName]) return makeError(`invalid API name: ${config.apiName}`);
      if (!client[config.apiName][config.methodName]) return makeError(`invalid method name ${config.methodName} in API ${config.apiName} `);


      const resolvePayload = (requestPayload) => {
        try {
          const parsedPayload = JSON.parse(requestPayload);
          const resolve = (acc, [key, value]) => {
            if (typeof value === 'string') {
              const resolvedValue = getTypedFieldValue(msg, value);
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
          return getTypedFieldValue(msg, requestPayload)
        }
      }
      client[config.apiName][config.methodName](resolvePayload(config.requestPayload))
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
