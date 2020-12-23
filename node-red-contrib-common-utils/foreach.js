const {ForEachState} = require("./array-map-state");
const {getTypedFieldValue} = require('../node-red-contrib-common-utils/1-global-utils');

module.exports = function (RED) {

  const state = new ForEachState(RED);

  function getMetaInfoKey(n) {
    return (n.name || n.id).replace(/\s/g, '').toLowerCase();
  }

  function ForEachStart(n) {
    RED.nodes.createNode(this, n);
    console.log('ForEachStart', n);
    const node = this;
    const event = "node:" + n.link;
    const backChannelEvent = 'back_channel_' + event;
    const metaInfoKey = getMetaInfoKey(n);

    // add timeout to let foreach-end mount
    setTimeout(() => {
      RED.nodes
        .getNode(n.link)
        .link = n.id;
    }, 100);

    const handler = function (msg) {
      const resolve = state.getResolveFn(msg, metaInfoKey);
      resolve && resolve();
    };

    RED.events.on(backChannelEvent, handler);

    this.on("input", async function (msg) {

      if (state.isIterationInProgress(msg, metaInfoKey)) {
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

        msg[metaInfoKey + msg._msgid] = {
          size: iterable.length,
          type: type
        };

        state.initResult(msg, metaInfoKey);

        for (const [key, value] of iterable) {
          // indexes are strings after Object.entries function applied to array
          msg[metaInfoKey + msg._msgid].key = type === 'array' ? +key : key;
          msg.value = value;

          node.send([null, msg]);
          console.log('sent message', key, value);
          await new Promise((resolve, reject) => {
            state.addResolveFn(msg, metaInfoKey, resolve);
            state.addBreakFn(msg, metaInfoKey, reject);
          });
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

  function cleanUpMsg(msg, state, metaInfoKey) {
    delete msg[metaInfoKey + msg._msgid];
    delete msg.__errorReason;
    delete msg.__stopReason;
    state.clearResult(msg, metaInfoKey);
    state.clearResolveFn(msg, metaInfoKey);
  }

  function ForEachEnd(n) {
    RED.nodes.createNode(this, n);
    const event = "node:" + n.id;
    const backChannelEvent = 'back_channel_' + event;
    const node = this;

    const handler = function (msg) {
      const self = RED.nodes.getNode(n.id);
      const metaInfoKey = getMetaInfoKey(RED.nodes.getNode(self.link));
      if (msg.__stopReason === 'break') {
        cleanUpMsg(msg, state, metaInfoKey);
        return node.send(msg);
      }
      if ([
        'empty_iterable',
        'iteration_end'
      ].includes(msg.__stopReason)) {
        msg.payload = state.getResult(msg, metaInfoKey);
        cleanUpMsg(msg, state, metaInfoKey);
        return node.send([null, msg]);
      }
      return node.send(msg);
    };

    RED.events.on(event, handler);

    this.on("input", function (msg) {
      // add little delay, to resolve issue, when message comes to foreach-end faster than
      // foreach-break, when no other delays exists, foreach-end may trigger another message from
      // foreach-start after break happened
      setTimeout(() => {
        const self = RED.nodes.getNode(n.id);
        state.addToResult(msg, getMetaInfoKey(RED.nodes.getNode(self.link)),  n.arrayField);
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
      const reject = state.getBreakFn(msg, getMetaInfoKey(RED.nodes.getNode(n.link)));
      console.log('break', reject);
      reject && reject();
      msg.__stopReason = 'break';
      RED.events.emit("node:" + n.link, msg);
    });
  }

  RED.nodes.registerType("foreach-break", ForEachBreak);
};
