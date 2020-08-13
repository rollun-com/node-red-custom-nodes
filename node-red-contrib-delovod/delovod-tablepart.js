module.exports = function (RED) {
  function FormatTablePart(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    this.config = RED.nodes.getNode(config.config);

    node.on('input', function (msg) {
      const makeError = text => {
        msg.payload = {error: text};
        node.send([msg, null]);
      };

      if (!config.tableParts) return makeError(`tableParts field is required`);
      if (!config.docType) return makeError(`docType is required`);
      if (!node.config) return makeError(`Config is required`);

      const payload = msg.payload || {};
      try {
        const tableParts = Object.entries(JSON.parse(config.tableParts))
          .reduce((acc, [tablePart, tablePartValue]) => {
            const resolveField = (val, baseObj) => {
              const [type, value] = global.utils.parseTypedInput(val);
              if (type === 'const') return value;
              return global.utils.resolvePath(baseObj, value);
            };

            const resolveFields = (baseObj) => {
              return Object.entries(tablePartValue)
                .map(([key, value]) => [key, resolveField(value, baseObj)])
                .reduce((acc, item) => {
                  acc[item[0]] = item[1];
                  return acc;
                }, {})
            }

            acc[tablePart] = Array.isArray(payload)
              ? payload.map(resolveFields)
              : resolveFields(payload);
            return acc
          }, {});
        msg.payload = {tableParts};
        node.send([null, msg]);
      } catch (e) {

        msg.payload = {error: e.message};
        node.send([msg, null]);
      }
    });
  }

  RED.nodes.registerType("delovod-tablepart", FormatTablePart);
}
