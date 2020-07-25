module.exports = function (RED) {
  function MegaplanConfig(n) {
    RED.nodes.createNode(this, n);
    const url = require('url');

    this.password = n.password;
    this.email = n.email;
    this.host = url.parse(n.host).href;
    console.log('host', this.host, n.host);
  }

  RED.nodes.registerType("megaplan-config", MegaplanConfig);
}
