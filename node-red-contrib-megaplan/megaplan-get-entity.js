module.exports = function (RED) {
  function MegaplanGetEntity(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    this.config = RED.nodes.getNode(config.config);


    node.on('input', function (msg) {
      const makeError = text => {
        msg.payload = {error: text};
        node.send([msg, null]);
      };

      if (!config.entityId) return makeError(`Entity ID field is required`);
      if (!config.entity) return makeError(`Entity field is required`);

      const [type, entityIdValue] = global.utils.parseTypedInput(config.entityId);

      const entityId = type === 'msg'
          ? global.utils.resolvePath(msg, entityIdValue.replace('/^msg.', ''))
          : entityIdValue;

      if (!entityId) return makeError('Field Entity ID cannot be empty!');

      const client = new global.megaplan.apiv3({host: node.config.host, email: node.config.email, password: node.config.password});

      client
          .getEntity(config.entity, entityId)
          .then(({data}) => {
            msg.payload = data;
            node.send([null, msg]);
          })
          .catch(err => {
            if (err.response) {
              // cannot serialise response with request property due to circular properties
              err.response.request = null;
            }
            msg.payload = err.response.data.meta;
            node.send([msg, null])
          });

      // node.send([null, msg]);
    });
  }

  RED.nodes.registerType("megaplan-get-entity", MegaplanGetEntity);
}
