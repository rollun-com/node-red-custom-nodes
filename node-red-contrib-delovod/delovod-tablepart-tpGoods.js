module.exports = function (RED) {
  function DelovodQuery(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    this.config = RED.nodes.getNode(config.config);


    node.on('input', function (msg) {
      const {getTypedFieldValue} = global.utils;

      const good = getTypedFieldValue(config.good, msg);
      const price = getTypedFieldValue(config.price, msg);
      const qty = getTypedFieldValue(config.qty, msg);
      const goodType = getTypedFieldValue(config.goodType, msg);
      const unit = getTypedFieldValue(config.unit, msg);
      msg.payload = {
        good,
        goodType, // Товар
        price: +price,
        // amountCur: +item.subTotal,
        qty: +qty,
        // baseQty: +item.quantity,
        unit, // шт
      }
      node.send(msg);
    });
  }

  RED.nodes.registerType("delovod-tablepart-tpGoods", DelovodQuery);
}
