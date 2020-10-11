module.exports = function (RED) {

  const _ = require('lodash');

  // Module to work with array-map-state
  const {
    addToResult, isFinished, getResult, clearResult
  } = (() => {
    // map _msgif -> array of results
    // DO NOT MODIFY DIRECTLY
    let arrayMapResults = {};

    const addToResult = ({payload, _msgid, type, key}) => {
      if (!arrayMapResults[_msgid]) {
        arrayMapResults[_msgid] = type === 'array' ? [] : {};
      }
      if (type === 'array') {
        arrayMapResults[_msgid].push(payload);
      } else {
        if (key === null || key === undefined || key === '') {
          key = RED.util.generateId()
        }
        arrayMapResults[_msgid][key] = payload;
      }
    }

    const isFinished = ({_msgid, totalItemsAmount, type}) => {
      if (type === 'array') {
        return arrayMapResults[_msgid].length === totalItemsAmount
      }
      return Object.keys(arrayMapResults[_msgid]).length === totalItemsAmount;
    }

    const getResult = ({_msgid, type}, filterEmpty = false) => {
      const toDel = (val) => val !== null && val !== undefined;
      if (type === 'array') {
        const arr = arrayMapResults[_msgid] || [];
        return filterEmpty
          ? arr.filter(toDel)
          : arr
      }
      if (type === 'object') {
        const obj = arrayMapResults[_msgid] || {};
        return filterEmpty
          ? Object.entries(obj)
            .filter(([, val]) => toDel(val))
            .reduce((acc, [key, value]) => {
              acc[key] = value;
              return acc;
            }, {})
          : obj
      }
    }

    const clearResult = ({_msgid}) => {
      if (arrayMapResults[_msgid]) {
        delete arrayMapResults[_msgid];
      }
    }

    return {
      addToResult, isFinished, getResult, clearResult
    }
  })()

  function ArrayMapStart({isSync = false} = {}) {
    return function (config) {
      RED.nodes.createNode(this, config);
      const node = this;
      this.config = RED.nodes.getNode(config.config);

      node.on('input', function (msg) {

        const makeError = (node, text) => {
          msg.payload = {error: text};
          node.send([null, msg])
        };

        const interval = +config.interval;

        if (!config.arrayField) return makeError(node, `arrayField is required!`);
        if (isNaN(interval) || interval < 0) return makeError(node, `interval is required, and must be a number > 0!`);


        (async () => {
          let iterable = global.utils.getTypedFieldValue(msg, config.arrayField);

          if (typeof iterable !== 'object') {
            throw new Error('Data in arrayField must be either object or array!');
          }

          const type = Array.isArray(iterable) ? 'array' : 'object';

          if (type === 'object') {
            iterable = Object.entries(iterable);
          }

          if (iterable.length === 0) {
            return makeError(node, `${type} is empty! Empty ${type} is not supported yet.`);
          }

          const {req, res} = msg;

          if (req) delete msg.req;
          if (res) delete msg.res;

          const msgid = RED.util.generateId();
          for (let i = 0, len = iterable.length; i < len; i++) {
            let key, value, index;
            if (type === 'array') {
              index = i;
              value = iterable[i];
            }

            if (type === 'object') {
              [key, value] = iterable[i];
            }

            const msgCopy = {
              _msgid: msgid,
              payload: _.cloneDeep(value),
              type,
              ...(index !== undefined && {index: i}),
              ...(key !== undefined && {key}),
              totalItemsAmount: len,
              topic: `Element #${i} of ${type}`,
              originalMsg: msg,
              req: req,
              res: res
            };

            node.send(msgCopy);

            if (isSync) {
              // store resolve func for promise, to call it from ArrayMapEnd, to 'resume' execution
              // therefore creating 'sync' effect
              await (new Promise(resolve => {
                arrayStartPromiseResolvers[msgCopy._msgid] = resolve;
              }))
            }

            await (new Promise(resolve => setTimeout(() => resolve(), +config.interval)));
          }

        })()
          .catch(err => {
            console.log(err);
            msg._isArrayMapError = true;
            msg.error = err.message;
            node.send(msg)
          })
      });

    }
  }

  RED.nodes.registerType("array-map-start", ArrayMapStart());
  RED.nodes.registerType("array-map-start-sync", ArrayMapStart({isSync: true}));

  let arrayStartPromiseResolvers = {};

  function ArrayMapEnd({isSync = false} = {}) {
    return function (config) {
      RED.nodes.createNode(this, config);
      const node = this;
      this.config = RED.nodes.getNode(config.config);

      let timeouted = false;
      let timeout
      const filterEmpty = !!config.filterEmpty;
      const [, resultField] = (config.resultField || 'msg|payload').split('|');

      const callArrayStartResolve = ({_msgid}) => {
        arrayStartPromiseResolvers[_msgid] && arrayStartPromiseResolvers[_msgid]();
      }

      const clearArrayStartResolve = ({_msgid}) => {
        if (arrayStartPromiseResolvers[_msgid]) {
          delete arrayStartPromiseResolvers[_msgid]
        }
      }

      node.on('input', function (msg) {

        !timeout && config.timeout > 0 && (timeout = setTimeout(() => {
          if (msg.originalMsg) {
            msg = msg.originalMsg;
          }
          clearResult(msg);
          msg.payload = {error: `Did not receive all items from array-map-start after ${config.timeout}ms`};
          node.send(msg);
          timeouted = true;
        }, config.timeout));

        if (timeouted) return;

        if (msg._isArrayMapError === true || msg.totalItemsAmount === undefined) {
          const orgError = msg.error || 'Unknown error';
          clearResult(msg);
          isSync && clearArrayStartResolve(msg)
          if (msg.originalMsg) {
            const req = msg.req;
            const res = msg.res;
            msg = msg.originalMsg;
            msg.res = res;
            msg.req = req;
          }
          if (msg._isArrayMapError) {
            msg.payload = {
              error: orgError
            }
          } else {
            msg.payload = {
              error: 'It seems like, you accidentally deleted totalItemsAmount from message, do not do it please.'
            }
          }
          node.send(msg);
        }

        addToResult(msg);
        isSync && callArrayStartResolve(msg);
        if (isFinished(msg)) {
          try {
            const finalMsg = {
              ...(msg.originalMsg || {}),
              [resultField]: getResult(msg, filterEmpty),
              req: msg.req,
              res: msg.res
            }
            clearResult(msg);
            isSync && clearArrayStartResolve(msg)
            node.send(finalMsg);
            clearTimeout(timeout);
          } catch (e) {
            console.log('cannot send result msg after map', e);
          }
        }
      });
    }
  }

  RED.nodes.registerType("array-map-end", ArrayMapEnd());
  RED.nodes.registerType("array-map-end-sync", ArrayMapEnd({isSync: true}));

  // function ArrayMapContinue(config) {
  //   RED.nodes.createNode(this, config);
  //   const node = this;
  //
  //   node.on('input', function (msg) {
  //     addToResult(msg);
  //   })
  // }
  //
  // RED.nodes.registerType("array-map-continue", ArrayMapContinue);
};
