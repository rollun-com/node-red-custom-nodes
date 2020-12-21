const {ArrayMapState} = require("./array-map-state");
const {getTypedFieldValue} = require('../node-red-contrib-common-utils/1-global-utils');

module.exports = function (RED) {

  const state = new ArrayMapState(RED);

  function ForEachStart(n) {
    RED.nodes.createNode(this, n);
    const node = this;
    const event = "node:" + n.link;
    const backChannelEvent = 'back_channel_' + event;

    const handler = function (msg) {
      const resolve = state.getResolveFn(msg);
      resolve && resolve();
    };

    RED.events.on(backChannelEvent, handler);

    this.on("input", async function (msg) {
      if (!n.arrayField) {
        msg.__errorReason = 'no_input_iterable';
        return RED.events.emit(event, msg);
      }
      let iterable = getTypedFieldValue(msg, n.arrayField);
      const type = Array.isArray(iterable) ? 'array' : (typeof iterable === 'object' ? 'object' : '');

      if (!type) {
        msg.__errorReason = 'invalid_iterable_type';
        return RED.events.emit(event, msg);
      }

      iterable = Object.entries(iterable);

      if (iterable.length === 0) {
        msg.__stopReason = 'empty_iterable';
        return RED.events.emit(event, msg);
      }
      try {
        for (const [key, value] of iterable) {
          // indexes are strings after Object.entries function applier to array
          msg.key = type === 'array' ? +key : key;
          msg.value = value;
          msg.size = iterable.length;
          msg.type = type;

          node.send(msg);
          await new Promise((resolve, reject) => {
            state.addResolveFn(msg, resolve);
            state.addBreakFn(msg, reject);
          })
        }
        msg.__stopReason = 'iteration_end';
        RED.events.emit(event, msg);
      } catch (e) {
        console.log(e);
      }

    });

    this.on("close", function () {
      RED.events.removeListener(event, handler);
    });
  }

  RED.nodes.registerType("foreach-start", ForEachStart);

  function cleanUpMsg(msg, state) {
    delete msg.key;
    delete msg.value;
    delete msg.size;
    delete msg.type;
    delete msg.__errorReason;
    delete msg.__stopReason;
    state.clearResult(msg);
    state.clearResolveFn(msg);
  }

  function ForEachEnd(n) {
    RED.nodes.createNode(this, n);
    const event = "node:" + n.id;
    const backChannelEvent = 'back_channel_' + event;
    const node = this;

    const handler = function (msg) {
      console.log('event in end');
      if (msg.__errorReason) {
        msg.error = msg.__errorReason;
        cleanUpMsg(msg, state);
        return node.send([null, msg]);
      }
      if (msg.__stopReason === 'empty_iterable') {
        cleanUpMsg(msg, state);
        return node.send(msg);
      }
      if (msg.__stopReason === 'iteration_end') {
        msg.payload = state.getResult(msg);
        cleanUpMsg(msg, state);
        return node.send(msg);
      }
    };

    RED.events.on(event, handler);

    this.on("input", function (msg) {
      state.addToResult(msg, getTypedFieldValue(msg, n.arrayField) || null);
      RED.events.emit(backChannelEvent, msg);
    });
    this.on("close", function () {
      RED.events.removeListener(event, handler);
    });
  }

  RED.nodes.registerType("foreach-end", ForEachEnd);

  function ForEachBreak(n) {
    RED.nodes.createNode(this, n);
    this.on("input", function (msg) {
      console.log('input in break');
      const reject = state.getBreakFn(msg);
      reject && reject();
      msg.__stopReason = 'iteration_end';
      RED.events.emit("node:" + n.link, msg);
    });
  }

  RED.nodes.registerType("foreach-break", ForEachBreak);
};
