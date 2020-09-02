module.exports = function (RED) {
  function MWSNode(config) {
    RED.nodes.createNode(this, config)
    this.action = config.action
    this.config = RED.nodes.getNode(config.config)
    const mws = this.config.client
    const node = this
    node.on('input', function (msg) {
      node.send(msg);
      // mws.client.finances.search({
      //   'Version': '2015-05-01',
      //   'Action': 'ListFinancialEventGroups',
      //   'SellerId': 'SELLER_ID',
      //   'MWSAuthToken': 'MWS_AUTH_TOKEN',
      //   'FinancialEventGroupStartedAfter': new Date(2016, 11, 24)
      // }).then(r => console.log('response', r))
      //   .catch(err => console.log('error ', err))
    });
  }

  RED.nodes.registerType('MWS', MWSNode)
}
