module.exports = function (RED) {
  const _ = require('lodash');

  function DeepMerge(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.on('input', function (msg) {
      const first = global.utils.getTypedFieldValue(msg, config.first);
      const second = global.utils.getTypedFieldValue(msg, config.second);

      const [, resultField] = global.utils.parseTypedInput(config.result);

      msg[resultField] = _.merge(first, second);
      node.send(msg);
    });
  }

  RED.nodes.registerType("deep-merge", DeepMerge);
};
