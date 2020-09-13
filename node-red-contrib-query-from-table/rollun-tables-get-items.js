module.exports = function (RED) {
  function Test(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.on('input', function (msg) {
      const makeError = (node, text) => {
        msg.error = text;
        msg.payload = undefined;
        node.send(msg)
      };

      if (!config.url) return makeError(node, `url is required!`);

      const {rql = 'limit(20,0)', url} = config;

      const datastore = new global.tables.Datastore({URL: url});
      const processedRql = global.tables.Datastore.resolveRQLWithREDMsg(rql, msg);

      datastore
        .query('', processedRql)
        .then(result => {
          msg.payload = result;
          node.send([null, msg]);
        })
        .catch(err => {
          msg.payload = {error: err.message};
          node.send([msg, null]);
        })
    });
  }

  RED.nodes.registerType("rollun-tables-get-items", Test);
}
