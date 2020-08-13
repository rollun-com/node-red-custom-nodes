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
        .getOne('', processedRql)
        .then(result => {

          if (result === null) {
            msg.payload = {error: 'No records found, or found 2 or more by this filter -' + processedRql};
            node.send([msg, null]);
          } else {
            msg.payload = result;
            node.send([null, msg])
          }
        })
        .catch(err => {

          if (err.response && err.response.request) {
            // cannot serialise response with request property due to circular properties
            err.response.request = null;
          }
          msg.payload = {error: err.message};
          msg.response = err.response;
          node.send([msg, null]);
        })
    });
  }

  RED.nodes.registerType("rollun-tables-get-item", Test);
}
