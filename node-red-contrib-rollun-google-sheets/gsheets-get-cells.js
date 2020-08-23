module.exports = function (RED) {
  function GSheetGetCells(sheetResponseFormatter = data => data) {
    return function(config) {
      RED.nodes.createNode(this, config);
      const node = this;
      this.config = RED.nodes.getNode(config.config);

      const URL = require('url');

      node.on('input', function (msg) {

        const makeError = (text) => {
          msg.payload = {error: text};
          node.send([msg, null])
        };


        if (!node.config) return makeError(`node.config is required!`);
        if (!config.sheetURL) return makeError(`sheetURL is required!`);
        if (!config.cells) return makeError(`cells is required!`);

        const sheetURL = global.utils.getTypedFieldValue(config.sheetURL, msg);
        const cells = global.utils.getTypedFieldValue(config.cells, msg);

        const parsedURL = URL.parse(sheetURL);

        const sheetIdMatch = parsedURL.path.match(/spreadsheets\/d\/(?<sheetId>[a-z0-9]+)\//i);
        const tableIdMatch = parsedURL.hash.match(/gid=(?<tableId>[0-9]+)/i);
        if (!sheetIdMatch) return makeError(`Could not get sheetId from sheetURL.`)
        if (!tableIdMatch) return makeError(`Could not get tableId from sheetURL.`)

        const {sheetId} = sheetIdMatch.groups;
        const {tableId} = tableIdMatch.groups;

        const {GoogleSpreadsheet} = require('google-spreadsheet');

        (async () => {

          const doc = new GoogleSpreadsheet(sheetId);

          await doc.useServiceAccountAuth(node.config.creds);


          await doc.loadInfo();
          await doc.loadCells(cells);


          msg.payload = sheetResponseFormatter(doc.sheetsById[tableId]);
          node.send([null, msg]);
        })()
          .catch(err => {
            msg.payload = {error: err.message};
            node.send([msg, null]);
          });
      });

    }
  }

  const formatSheet = sheet => {
    const cells = sheet._cells;
    if (cells.length === 0) return [];
    const header = cells[0].map(cell => cell._rawData.userEnteredValue.stringValue);
    return cells.slice(1).map(row => {
      return row.reduce((acc, {_rawData}, idx) => {
        acc[header[idx]] = {
          userEnteredValueString: _rawData.userEnteredValue.stringValue,
          userEnteredValueNumber: _rawData.userEnteredValue.numberValue,
          effectiveValueString: _rawData.effectiveValue.stringValue,
          effectiveValueNumber: _rawData.effectiveValue.numberValue,
          formattedValue: _rawData.formattedValue
        }
        return acc;
      }, {});
    });
  };

  RED.nodes.registerType("gsheets-get-cells-raw", GSheetGetCells());
  RED.nodes.registerType("gsheets-get-cells-formatted", GSheetGetCells(formatSheet));
}
