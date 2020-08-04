module.exports = function (RED) {
  function GSheetGetCells(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    this.config = RED.nodes.getNode(config.config);


    node.on('input', function (msg) {

      const makeError = (text) => {
        msg.error = {error: text};
        msg.payload = undefined;
        node.send([msg, null])
      };

      console.log('incoming input', config);
      if (!node.config) return makeError(`node.config is required!`);
      if (!config.sheetId) return makeError(`sheetId is required!`);

      const [type, value] = global.utils.parseTypedInput(config.cells);
      const cells = (type === 'msg'
        ? global.utils.resolvePath(msg, value)
        : value) || 'A1:B10';

      const [tableIdType, tableIdValue] = global.utils.parseTypedInput(config.tableId);
      const tableId = (tableIdType === 'msg'
        ? global.utils.resolvePath(msg, tableIdValue)
        : tableIdValue) || '0';

      const {GoogleSpreadsheet} = require('google-spreadsheet');

      (async () => {
        console.log('sheet id', config.sheetId, tableId, cells)
        const doc = new GoogleSpreadsheet(config.sheetId);

        await doc.useServiceAccountAuth(node.config.creds);

        console.log('before load');
        await doc.loadInfo();
        await doc.loadCells(cells);
        console.log('title', doc.title);

        const sheet = doc.sheetsById[tableId];
        msg.payload = sheet;
        node.send([null, msg]);
      })()
        .catch(err => {
          console.log(err);
          msg.payload = {error: err.message};
          node.send([msg, null]);
        });

    });
  }

  RED.nodes.registerType("gsheets-get-cells", GSheetGetCells);
}
