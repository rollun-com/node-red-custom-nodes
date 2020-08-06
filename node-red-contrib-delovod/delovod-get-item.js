module.exports = function (RED) {
  function Filter(config) {
    RED.nodes.createNode(this, config);
    this.config = RED.nodes.getNode(config.config);
    const node = this;

    node.on('input', function (msg) {
      const axios = require('axios');

      const makeError = (node, text) => {
        msg.error = {error: text};
        msg.payload = undefined;
        node.send(msg)
      };

      console.log('incoming input', config);

      if (!node.config) return makeError(node, `node.config is required!`);
      if (!config.docType) return makeError(node, `config.docType is required!`);

      const conditions = JSON.parse(config.conditions).map(cond => {
        let value = cond.value;
        if (value.indexOf('msg') === 0) {
          value = global.utils.resolvePath(msg, value.replace(/^msg\./, ''));
        }
        return {...cond, value};
      });

      const fields = conditions.reduce((acc, cond) => {
        acc[cond.alias] = cond.alias;
        return acc
      }, {});

      if (!('id' in fields)) {
        fields.id = 'id'
      }

      const {GET_OBJECT, REQUEST} = global.delovod.actions;

      const actionType = conditions.length === 1 && conditions[0].alias === 'id'
        ? GET_OBJECT
        : REQUEST;

      const url = node.config.host;
      const packet = `packet=${JSON.stringify({
        version: node.config.version,
        key: node.config.key,
        action: actionType,
        params: actionType === REQUEST
          ? {
            from: config.docType,
            fields: fields,
            filters: conditions
          }
          : {
            id: conditions[0].value
          }
      })}`;
      const errorField = config['errorField'] || 'error';
      console.log('send request to ', url, packet);
      msg.sentPacket = packet;
      axios
        .post(url, packet, {
          timeout: 10000,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .then(({data}) => {
          console.log('got result', data);
          if (data.error || (Array.isArray(data) && data.length !== 1)) {
            const errMsg = data.error
              || (data.length > 1 && `Found more than one document by filter: ${data.map(({id__pr}) => id__pr).join(', ')}`)
              || (data.length === 0 && `Not found any documents by filter!`)
            msg.payload = {[errorField]: `[node: ${config.name}] ` + errMsg}
            node.send([msg, null]);
          } else {
            msg.payload = Array.isArray(data) ? data[0] : data;
            node.send([null, msg]);
          }
        })
        .catch(err => {
          console.log('got error', err);
          msg.payload = {[errorField]: `[node: ${config.name}] ` + err.message}
          if (err.response) {
            // cannot serialise response with request property due to circular properties
            err.response.request = null;
          }
          msg.response = err.response;
          node.send([msg, null]);
        })
    })
  }

  RED.nodes.registerType("delovod-get-item", Filter);
}
