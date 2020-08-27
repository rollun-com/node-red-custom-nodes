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


      (async () => {
        let iterable = global.utils.getTypedFieldValue(config.arrayField, msg);

        if (typeof iterable !== 'object') {
          throw new Error('Data in arrayField must be either object or array!');
        }

        const type = Array.isArray(iterable) ? 'array' : 'object';

        const {req, res} = msg;

        if (req) delete msg.req;
        if (res) delete msg.res;

        if (type === 'object') {
          iterable = Object.entries(iterable);
        }

        for (let i = 0, len = iterable.length; i < len; i++) {
          let key, value, index;
          if (type === 'array') {
            index = i;
            value = iterable[i];
          }

          if (type === 'object') {
            [key, value] = iterable[i];
          }

          const msgCopy = {
            _msgid: msg._msgid,
            payload: _.cloneDeep(value),
            type,
            ...(index !== undefined && {index: i}),
            ...(key !== undefined && {key}),
            totalItemsAmount: len,
            topic: `Element #${i} of iterable`,
            originalMsg: msg,
            req: req,
            res: res
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
