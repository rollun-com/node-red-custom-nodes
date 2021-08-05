const OpenAPIRequestValidator = require('openapi-request-validator').default;
const axios = require('axios');
const { getLifecycleToken, defaultLogger } = require('../../node-red-contrib-common-utils/1-global-utils');

module.exports = function (RED) {
  function openApiRed(config) {
    RED.nodes.createNode(this, config)
    const node = this

    const configNode = RED.nodes.getNode(config.schema)
    const schema = configNode ? configNode.schema : null;

    function sendError(msg, text) {
      msg.payload = {
        error: text,
      }
      return node.send([msg]);
    }

    node.on('input', async function (msg) {
      if (!schema) {
        return sendError(msg, 'No openapi schema selected.');
      }

      const [method, methodName] = config.operation.split(' ');

      const endpointConfig = schema.paths[methodName][method];
      if (!endpointConfig) {
        return sendError(msg, `No method found by operation ${config.operation}`);
      }

      const validator = new OpenAPIRequestValidator({
        ...endpointConfig,
        schemas: schema.components.schemas,
      });

      const headers = msg.headers || {};
      const { LT, PLT } = getLifecycleToken(msg);
      console.log(LT, PLT);
      const request = {
        headers: {
          ...headers,
          ...(!headers['content-type'] && { 'content-type': 'application/json' }),
          lifecycle_token: LT,
          ...(PLT && { parent_lifecycle_token: PLT }),
        },
        body: msg.body || {},
        params: msg.params || {},
        query: msg.query || {},
      }

      if (!config.disableValidation) {
        try {
          const validationResult = validator.validateRequest(request);
          if (validationResult) {
            const { status, errors = [] } = validationResult;
            msg.payload = {
              status,
              headers: {},
              body: {
                data: null,
                messages: errors.map(({ location = '', path, message }) => ({
                  level: 'error',
                  type: 'OPENAPI_REQUEST_VALIDATION_ERROR',
                  text: `[${location}.${path}] ${message}`,
                })),
              }
            }
            return node.send([msg]);
          }
        } catch (e) {
          return sendError(msg, e.message);
        }
      }

      let requestConfig;
      try {
        let url = schema.servers[0]?.url + methodName;
        if (Object.keys(request.params).length > 0) {
          url = url.replace(/{.+}/g, (match) => {
            const paramName = match.slice(1, -1);
            return request.params[paramName];
          });
        }
        requestConfig = {
          url,
          method: method.toUpperCase(),
          headers: request.headers,
          data: request.body,
          params: request.query,
        }
        defaultLogger.withMsg(msg)(
          'info',
          `OpenAPIClientReq: ${requestConfig.method} ${url}`,
          { ...requestConfig },
        );
        const { status, headers, data } = await axios(requestConfig);
        defaultLogger.withMsg(msg)(
          'info',
          `OpenAPIClientRes: ${requestConfig.method} ${requestConfig.url}`,
          { status, headers, messages: data.messages },
        );
        msg.payload = {
          status,
          headers,
          data,
        };
        node.send([null, msg]);
      } catch (e) {
        const defaultMessage = {
          level: 'error',
          type: 'UNKNOWN_REQUEST_ERROR',
          message: e.message,
        }
        const { data = null, messages = [defaultMessage] } = (e.response || {}).data || {};
        msg.payload = {
          status: e.status || 'UNKNOWN',
          headers: {},
          body: {
            data,
            messages,
          }
        }
        defaultLogger.withMsg(msg)(
          'error',
          `OpenAPIClientRes: ${requestConfig && requestConfig.method} ${requestConfig && requestConfig.url}`,
          { status: e.status || 'UNKNOWN', ...(requestConfig || {}), messages },
        );
        return node.send([msg]);
      }
    })
  }

  RED.nodes.registerType('rollun-openapi-client', openApiRed)
}
