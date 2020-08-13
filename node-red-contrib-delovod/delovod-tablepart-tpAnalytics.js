module.exports = function (RED) {
  function DelovodQuery(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    this.config = RED.nodes.getNode(config.config);

    node.on('input', function (msg) {

      const makeError = (text) => {

        msg.payload = {error: text};
        node.send([msg, null]);
      };


      if (!node.config) return makeError(`node.config is required!`);
      const [amountCurType, amountCurVal] = config.amountCur.split('|');
      const [analytics2Type, analytics2Val] = config.analytics2.split('|');

      const amountCur = amountCurType === 'msg' ? global.utils.resolvePath(msg, amountCurVal) : amountCurVal;
      const analytics2 = analytics2Type === 'msg' ? global.utils.resolvePath(msg, analytics2Val) : analytics2Val;

      if (!amountCur) return makeError(`amountCur is required!`);
      if (!analytics2) return makeError(`analytics2 is required!`);

      msg.payload = {
        tpAnalytics: {
          amountCur,
          analytics2
        }
      };
      node.send([null, msg]);
    });
  }

  RED.nodes.registerType("delovod-tablepart-tpAnalytics", DelovodQuery);
}
