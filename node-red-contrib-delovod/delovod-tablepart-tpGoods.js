module.exports = function (RED) {
  function DelovodQuery(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    this.config = RED.nodes.getNode(config.config);


    node.on('input', function (msg) {
      const {getTypedFieldValue} = global.utils;

      const good = getTypedFieldValue(msg, config.good);
      const price = +getTypedFieldValue(msg, config.price);
      const qty = +getTypedFieldValue(msg, config.qty);
      const goodType = getTypedFieldValue(msg, config.goodType);
      const unit = getTypedFieldValue(msg, config.unit);
      msg.payload = {
        good,
        goodType, // Товар
        price: price,
        amountCur: price * qty,
        qty: qty,
        // baseQty: +item.quantity,
        unit, // шт
      }
      node.send(msg);
    });
  }

  RED.nodes.registerType("delovod-tablepart-tpGoods", DelovodQuery);
}
