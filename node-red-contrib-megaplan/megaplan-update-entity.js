module.exports = function (RED) {
  function MegaplanUpdateEntity(config) {
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
      if (!config.body) return makeError(`Body field is required`);

      const [entityIdtype, entityIdValue] = global.utils.parseTypedInput(config.entityId);

      const entityId = entityIdtype === 'msg'
        ? global.utils.resolvePath(msg, entityIdValue.replace('/^msg.', ''))
        : entityIdValue;

      if (!entityId) return makeError('Field Entity ID cannot be empty!');

      const [bodyType, bodyValue] = global.utils.parseTypedInput(config.body);

      const body = bodyType === 'msg'
        ? global.utils.resolvePath(msg, bodyValue.replace('/^msg.', ''))
        : bodyValue;


      const client = new global.megaplan.apiv3({host: node.config.host, email: node.config.email, password: node.config.password});
      console.log('body' , body);
      client
        .updateEntity(config.entity, entityId, body)
        .then(res => {
          msg.payload = res.data.data;
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

    });
  }

  RED.nodes.registerType("megaplan-update-entity", MegaplanUpdateEntity);
}
