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
      if (state.isIterationInProgress(msg)) {
        msg.error = 'iteration_is_already_in_progress';
        return node.send(msg);
      }

      if (!n.arrayField) {
        msg.__errorReason = 'no_input_iterable';
        return RED.events.emit(event, msg);
      }
      let iterable = getTypedFieldValue(msg, n.arrayField);
      const type = Array.isArray(iterable) ? 'array' : (typeof iterable === 'object' ? 'object' : '');

      if (!type) {
        msg.error = 'invalid_iterable_type';
        return node.send(msg);
      }

      iterable = Object.entries(iterable);

      if (iterable.length === 0) {
        msg.__stopReason = 'empty_iterable';
        return RED.events.emit(event, msg);
      }

      try {
        msg.size = iterable.length;
        msg.type = type;

        state.initResult(msg);

        for (const [key, value] of iterable) {
          // indexes are strings after Object.entries function applied to array
          msg.key = type === 'array' ? +key : key;
          msg.value = value;

          node.send([null, msg]);
          console.log('sent message', key, value);
          await new Promise((resolve, reject) => {
            state.addResolveFn(msg, resolve);
            state.addBreakFn(msg, reject);
          })
          console.log('after promise');
        }
        msg.__stopReason = 'iteration_end';
        RED.events.emit(event, msg);
      } catch (e) {
        console.log('err', e);
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
      if (msg.__stopReason === 'break') {
        cleanUpMsg(msg, state);
        return node.send(msg);
      }
      if ([
        'empty_iterable',
        'iteration_end'
      ].includes(msg.__stopReason)) {
        msg.payload = state.getResult(msg);
        cleanUpMsg(msg, state);
        return node.send([null, msg]);
      }
      return node.send(msg);
    };

    RED.events.on(event, handler);

    this.on("input", function (msg) {
      // add little delay, to resolve issue, when message comes to foreach-end faster than
      // foreach-break, when no other delays exists, foreach-end may trigger another message from
      // foreach-start after break happened
      setInterval(() => {
        state.addToResult(msg, getTypedFieldValue(msg, n.arrayField) || null);
        RED.events.emit(backChannelEvent, msg);
      }, 100);
    });
    this.on("close", function () {
      RED.events.removeListener(event, handler);
    });
  }

  RED.nodes.registerType("foreach-end", ForEachEnd);

  function ForEachBreak(n) {
    RED.nodes.createNode(this, n);
    this.on("input", function (msg) {
      const reject = state.getBreakFn(msg);
      console.log('break', reject);
      reject && reject();
      msg.__stopReason = 'break';
      RED.events.emit("node:" + n.link, msg);
    });
  }

  RED.nodes.registerType("foreach-break", ForEachBreak);
};
