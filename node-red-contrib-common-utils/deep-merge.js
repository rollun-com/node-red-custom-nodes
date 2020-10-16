const {getTypedFieldValue, parseTypedInput} = require('../node-red-contrib-common-utils/1-global-utils')


module.exports = function (RED) {
  const _ = require('lodash');

  function DeepMerge(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.on('input', function (msg) {
      const first = getTypedFieldValue(msg, config.first);
      const second = getTypedFieldValue(msg, config.second);

      const [, resultField] = (config.result);

      msg[resultField] = _.merge(first, second);
      node.send(msg);
    });
  }

  RED.nodes.registerType("deep-merge", DeepMerge);
};
