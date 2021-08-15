"use strict";
const queue = require("./queue");
const { defaultLogger } = require('../../node-red-contrib-common-utils/1-global-utils');
const { getLifecycleToken, resolvePayload } = require('../../node-red-contrib-common-utils/1-global-utils');

function getStatusCodeFromMessages(msgs = []) {
  return msgs.some(({ level }) => level === 'error') ? 500 : 200;
}

module.exports = function register(RED) {
  RED.nodes.registerType('rollun-openapi-out', function openapiOutNode(props) {
    const _this = this;
    RED.nodes.createNode(this, props);

    this.on('input', function (msg) {
      try {
        const { lToken, plToken } = getLifecycleToken(msg);

        if (!lToken) {
          _this.error('Lifecycle token not found');
          return;
        }

        const { data, messages = [] } = resolvePayload(msg, { data: props.data, messages: props.messages });

        let msgs = messages;
        if (!props.disableGenerationOfExceptionMessage) {
          const { message, source: { id, type } } = msg.error;
          msgs = [{
            level: 'error',
            // type: 'NODE_RED_NODE_EXCEPTION',
            type: 'UNDEFINED',
            text: `Caught exception in node ${id} of type ${type} with message: '${message}'`,
          }].concat(msgs);
        }

        queue.dequeue(lToken, function (req, res, __) {
          const statusCode = getStatusCodeFromMessages(msgs);

          res.set('lifecycle_token', lToken);
          res.set('parent_lifecycle_token', plToken || '');
          res
            .status(statusCode)
            .send({ data: statusCode === 200 && data ? data : null, messages: msgs });
          res.on('finish', () => {
            if (!res.errorLogged) {
              defaultLogger.withMsg(msg)(
                'info',
                `OpenAPIServerRes: ${req.method} ${req.path}`,
                { status: statusCode },
              );
            }
          });
        });
      } catch (err) {
        console.log(err);
        _this.error(err);
      }
    });
  });
};
