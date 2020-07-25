module.exports = function (RED) {
  function DelovodQuery(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    this.config = RED.nodes.getNode(config.config);
    console.log('create node', config, this.config);

    node.on('input', function (msg) {
      const Axios = require('axios');
      let items = msg.payload;

      const makeError = (text) => {
        console.log('ERROR', text);
        msg.payload = {error: text};
        node.send([msg, null]);
      };

      console.log('incoming input', msg.payload);
      if (!node.config) return makeError(`node.config is required!`);
      if (!items || !Array.isArray(items)) return makeError(`msg.payload is required to be an array!`);
      try {
        items = items.map((el, idx) => {
          const [pnType, pnVal] = config.partNumber.split('|');
          const [priceType, priceVal] = config.price.split('|');
          const [qtyType, qtyVal] = config.qty.split('|');
          const [stType, stVal] = config.subTotal.split('|');

          const getValue = (type, val, el) => {
            console.log(type, val, el);
            let newVal;
            if (type === 'msg') {
              const path = val.replace(/\.?([a-z_\-0-9]+)$/i, `[${idx}].$1`);
              newVal = global.utils.resolvePath(msg, path);
              if (!newVal) throw new Error(`msg.${path} cannot be empty!`);
            } else {
              newVal = val;
            }
            return newVal
          }

          return {
            id: getValue(pnType, pnVal, el),
            unitPrice: getValue(priceType, priceVal, el),
            subTotal: getValue(stType, stVal, el),
            quantity: getValue(qtyType, qtyVal, el)
          }
        });
      } catch (e) {
        return makeError('Error while formatting incoming items: ' + e.message);
      }

      // const itemIdxWithWrongFormat = items.findIndex(({id, unitPrice, subTotal, quantity}) => !(id && unitPrice && subTotal && quantity && quantity > 0))
      // if (itemIdxWithWrongFormat > -1) {
      //   return makeError(`item #${itemIdxWithWrongFormat} must have 4 required fields - id, unitPrice, subTotal, quantity`);
      // }

      const url = node.config.host;

      const axios = Axios.create({
        baseURL: url,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: 10000,
      });



      (async () => {
        if (items.length > 5) throw new Error(`too many items, expected no more than 5, got ${items.length}.`);
        let delovodItems = (await Promise.all(items.map(item => {
          return axios.post('', global.delovod.util.formatDelovodRequest({
              from: 'catalogs.goods',
              fields: {
                "id": "id",
                "name": "name"
              },
              filters: [{
                alias: "name", operator: "=", value: item.id
              }]
            },
            global.delovod.actions.REQUEST,
            {...node.config}
          ))
        }))).map(({data}) => data).reduce((acc, val) => acc.concat(val), []);
        const itemsNotInDelovod = items.filter(({id}) => !delovodItems.find(it => it.name === id));
        const createdItems = (await Promise.all(itemsNotInDelovod.map(item => {
            return (async () => {
              const {data} = await axios.post('', global.delovod.util.formatDelovodRequest({
                header: {
                  id: 'catalogs.goods',
                  name: item.id
                }
              }, global.delovod.actions.SAVE_OBJECT, {...node.config}))
              return {
                name: item.id,
                ...data
              }
            })();
          }
        )))
        const allDelovodItems = [...delovodItems, ...createdItems];

        msg.payload = {
          tpGoods: items.map(item => ({
            good: allDelovodItems.find(el => el.name === item.id).id,
            goodType: "1004000000000014",
            price: +item.unitPrice,
            amountCur: +item.subTotal,
            qty: +item.quantity,
            baseQty: +item.quantity,
            unit: "1103600000000001"
          }))
        }
        node.send([null, msg]);
      })()
        .catch(err => {
          msg.payload = {
            error: err.message
          }
          node.send([msg, null]);
        });
    });
  }

  RED.nodes.registerType("delovod-tablepart-tpGoods", DelovodQuery);
}
