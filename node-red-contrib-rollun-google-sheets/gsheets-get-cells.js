module.exports = function (RED) {
  function GSheetGetCells(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    this.config = RED.nodes.getNode(config.config);
    console.log('create node', config, this.config);

    node.on('input', function (msg) {

      const makeError = (text) => {
        msg.error = {error: text};
        msg.payload = undefined;
        node.send([msg, null])
      };

      console.log('incoming input', config);
      if (!node.config) return makeError(`node.config is required!`);
      if (!config.sheetId) return makeError(`sheetId is required!`);

      const cells = config.cells || 'A1:B10';

      const {GoogleSpreadsheet} = require('google-spreadsheet');

      (async () => {
        console.log('sheet id', config.sheetId)
        const doc = new GoogleSpreadsheet(config.sheetId);

        console.log('creds', node.config.creds);
        await doc.useServiceAccountAuth(node.config.creds);

        await doc.loadInfo(true);
        console.log(doc.title);

        const sheet = doc.sheetsByIndex[0];
        console.log(sheet);
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
