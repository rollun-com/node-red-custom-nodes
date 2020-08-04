module.exports = function (RED) {
  function ElasticLogger(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    this.config = RED.nodes.getNode(config.config);

    const log_levels = {
      debug: {value: 0, name: 'debug', description: ''},
      notice: {value: 1, name: 'notice', description: ''},
      info: {value: 2, name: 'info', description: ''},
      warning: {value: 3, name: 'warning', description: ''},
      error: {value: 4, name: 'error', description: ''},
      alert: {value: 5, name: 'alert', description: ''},
      critical: {value: 6, name: 'critical', description: ''},
      emergency: {value: 7, name: 'emergency', description: ''},
    }

    class UDPClient {
      constructor(host, port) {
        this._client = require('dgram').createSocket('udp4');
        this.host = host;
        this.port = port;
      }

      static _encodeData(data) {
        const encodedDataString = typeof data === 'string'
          ? data
          : JSON.stringify(data);
        return Buffer.from(encodedDataString);
      }

      send(data, cb = () => {
      }) {
        if (cb) {
          this._client.send(
            UDPClient._encodeData(data),
            this.port,
            this.host,
            cb
          )
        } else {
          return new Promise((resolve, reject) => {
            this._client.send(
              UDPClient._encodeData(data),
              this.port,
              this.host,
              error => error ? reject(error) : resolve()
            )
          });
        }
      };
    }


    class ElasticLogger {
      constructor(opts) {
        this.index_name = opts.index_name;
        this.lifecycle_token = opts.lifecycle_token;
        this.parent_lifecycle_token = opts.parent_lifecycle_token;
        this.udp_client = new UDPClient(opts.host, opts.port);
      }

      async _logProduction(log_level, message, context, lifecycle_token) {

        try {
          // log to logstash via udp
          await this.udp_client.send({
            _index_name: this.index_name,
            level: log_level,
            message,
            context: context ? JSON.stringify(context) : null,
            timestamp: (new Date()).toISOString(),
            lifecycle_token: this.lifecycle_token || lifecycle_token || null,
            parent_lifecycle_token: this.parent_lifecycle_token || null
          });
        } catch (err) {
          console.error(`Couldn't log [${message}] message`, err, err.meta);
        }
      }

      async log(log_level, message, context, lifecycle_token) {
        console.log('About to log!', log_level, message);
        return this._logProduction(log_level, message, context, lifecycle_token);
      }
    }

    const logger = new ElasticLogger({
      index_name: node.config.indexName,
      host: node.config.logstashHost,
      port: node.config.logstashPort
    });
    node.on('input', function (msg) {
      console.log('input', config);
      const {value: minLogLevelValue} = Object.values(log_levels).find(({name}) => name === node.config.minLevel);
      const {value} = Object.values(log_levels).find(({name}) => name === config.level);

      (async () => {
        const [messageFieldType, messageFieldValue] = global.utils.parseTypedInput(config.messageField);
        const [contextFieldType, contextFieldValue] = global.utils.parseTypedInput(config.contextField);

        const message = messageFieldType === 'msg'
          ? global.utils.resolvePath(msg, messageFieldValue)
          : messageFieldValue;

        const context = contextFieldType === 'msg'
          ? global.utils.resolvePath(msg, contextFieldValue)
          : contextFieldValue;

        if (value >= minLogLevelValue) {
          try {
            if (typeof message !== 'string') throw new Error(`message must be of type string - ${typeof message} given!`);
            await logger.log(config.level, message || 'default message', context, msg._msgid);
            node.warn({
              topic: `Message logged to elasticsearch.`,
              message, context
            })
          } catch (err) {
            console.log('err', err);
            node.error({
              topic: `Error: ${err.message}.`,
              message, context
            })
          }
        } else {
          console.log('not logged');
          node.warn({
            topic: `Message not logged, minimal log level from config is bigger than current log level.`,
            message, context
          })
        }
      })()
    });
  }

  RED.nodes.registerType("elastic-logger", ElasticLogger);
}
