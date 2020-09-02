const _ = require('lodash');

module.exports = function (RED) {
  function MWSNode(config) {

    RED.nodes.createNode(this, config)
    this.action = config.action
    this.config = RED.nodes.getNode(config.config)
    const mws = this.config.client
    const node = this
    node.on('input', function (msg) {

      const category = _.camelCase(config.category);
      const api = mws[category];

      if (!api) {
        msg.payload = {error: `Unknown category: ${config.category} (${category})`}
        return node.send([msg]);
      }

      const payload = global.utils.getTypedFieldValue(config.actionPayload, msg) || {};
      if (typeof payload !== "object") {
        msg.payload = {error: `Action payload must be an object`}
        return node.send([msg]);
      }

      const version = global.utils.getTypedFieldValue(config.version, msg);
      const action = global.utils.getTypedFieldValue(config.action, msg);

      console.log(config, version, action);

      api.search({
        'Version': version,
        'Action': config.action,
        'SellerId': this.merchantId,
        'MWSAuthToken': this.MWSAuthToken,
        ...payload
      }).then(r => {
        console.log('response', r)
        msg.payload = r;
        node.send([null, msg]);
      })
        .catch(err => {
          console.log('error ', err)
          msg.payload = {
            error: Object.entries(err).reduce((acc, [key, val]) => {
              acc[key] = val;
              return acc;
            }, {})
          };
          node.send([msg, null]);
        })
    });
  }

  RED.nodes.registerType('MWS', MWSNode)
}
