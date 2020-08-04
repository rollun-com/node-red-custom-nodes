module.exports = function (RED) {
  function ElasticLoggerConfig(n) {
    RED.nodes.createNode(this, n);

    this.logstashHost = n.logstashHost;
    this.logstashPort = n.logstashPort;
    this.indexName = n.indexName;
    this.minLevel = n.minLevel;
  }

  RED.nodes.registerType("elastic-logger-config", ElasticLoggerConfig);
}
