module.exports = function (RED) {
  function ArrayMapStart(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    this.config = RED.nodes.getNode(config.config);

    node.on('input', function (msg) {
      const _ = require('lodash');

      const makeError = (node, text) => {
        msg.error = {error: text};
        msg.payload = undefined;
        node.send(msg)
      };

      const interval = +config.interval;

      if (!config.arrayField) return makeError(node, `arrayField is required!`);
      if (isNaN(interval) || interval < 0) return makeError(node, `interval is required, and must be a number > 0!`);

      const [type, value] = global.utils.parseTypedInput(config.arrayField);


      (async () => {
        let array
        try {
          array = type === 'json'
            ? JSON.parse(value)
            : global.utils.resolvePath(msg, value);
        } catch (e) {
          throw new Error('Cannot parse given array: - ' + e.message);
        }

        if (!Array.isArray(array)) {
          throw new Error('data in arrayField is not of type Array!');
        }

        //
        for (let i = 0; i < array.length; i++) {
          const el = array[i];

          console.log('sending el', i,  el);
          console.log('sending array', i, array);
          console.log('original msg', i, msg);

          const msgCopy = {
            payload: el,
            index: i,
            array: array,
            totalItemsAmount: array.length,
            topic: `Element #${i} of array`,
            originalMsgDoNotTouch: msg
          };
          node.send(msgCopy);

          await (new Promise(resolve => setTimeout(() => resolve(), +config.interval)));
        }

      })()
        .catch(err => {
          console.log(err);
          msg._isArrayMapError = true;
          msg.error = err.message;
          node.send(msg)
        })
    });
  }

  RED.nodes.registerType("array-map-start", ArrayMapStart);
};
