module.exports = function (RED) {
  const _ = require('lodash');

  function DeepMerge(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.on('input', function (msg) {
      const first = global.utils.getTypedFieldValue(config.first, msg);
      const second = global.utils.getTypedFieldValue(config.second, msg);

      const [, resultField] = global.utils.parseTypedInput(config.result);

      msg[resultField] = _.merge(first, second);
      node.send(msg);
    });
  }

  RED.nodes.registerType("deep-merge", DeepMerge);
};
