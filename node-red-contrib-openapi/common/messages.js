"use strict";
const _ = require('lodash');
const { parseTypedInput, resolvePayload } = require('../../node-red-contrib-common-utils/1-global-utils');

module.exports = function register(RED) {
  RED.nodes.registerType('rollun-openapi-messages', function openapiOutNode(props) {
    const _this = this;
    RED.nodes.createNode(this, props);

    this.on('input', function (msg) {
      const { oldMessages = [], text, type } = resolvePayload(msg, {
        oldMessages: props.oldMessages,
        text: props.text,
        type: props.msgType,
      });

      const message = {
        level: props.level,
        text,
        type,
      };
      const messages = [...oldMessages, message];
      const [, val] = parseTypedInput(props.oldMessages);

      if (val) {
        _.set(msg, val, messages);
      } else {
        msg.messages = messages;
      }

      _this.send(msg)
    });
  });
};
