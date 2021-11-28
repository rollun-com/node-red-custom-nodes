const { getGSheet, parseGSheetUrl } = require('./utils');
const { getTypedFieldValue } = require('../node-red-contrib-common-utils/1-global-utils')

module.exports = function (RED) {
  function GSheetGetCells(sheetResponseFormatter = data => data) {
    return function (config) {
      RED.nodes.createNode(this, config);
      const node = this;
      this.config = RED.nodes.getNode(config.config);

      node.on('input', async function (msg) {

        const makeError = (text) => {
          msg.payload = { error: text };
          node.send([msg, null])
        };

        if (!node.config) return makeError(`node.config is required!`);
        if (!config.sheetURL) return makeError(`sheetURL is required!`);
        if (!config.cells) return makeError(`cells is required!`);

        const sheetURL = getTypedFieldValue(msg, config.sheetURL);
        const cells = getTypedFieldValue(msg, config.cells);

        try {
          const { tableId, sheetId } = parseGSheetUrl(sheetURL);
          const sheet = await getGSheet(sheetId, tableId, node.config.creds, { loadCells: cells });

          msg.payload = sheetResponseFormatter(sheet);
          node.send([null, msg]);
        } catch (e) {
          msg.payload = { error: e.message };
          node.send([msg, null]);
        }
      });
    }
  }

  const formatSheet = sheet => {
    const cells = sheet._cells;
    if (cells.length === 0) return [];
    const header = cells[0].map((cell, idx) => {
      if (!cell._rawData.userEnteredValue) {
        throw new Error(`Header row at column #${idx + 1} does not have value!`);
      }
      return cell._rawData.userEnteredValue.stringValue
    });
    return cells
      .slice(1)
      .map(row =>
        row.reduce((acc, { _rawData }, idx) => {
          const { userEnteredValue = {}, effectiveValue = {}, formattedValue = '' } = _rawData;
          return {
            ...acc,
            [header[idx]]: {
              userEnteredValueString: userEnteredValue.stringValue,
              userEnteredValueNumber: userEnteredValue.numberValue,
              effectiveValueString: effectiveValue.stringValue,
              effectiveValueNumber: effectiveValue.numberValue,
              formattedValue: formattedValue
            }
          };
        }, {})
      );
  };

  RED.nodes.registerType("gsheets-get-cells-raw", GSheetGetCells());
  RED.nodes.registerType("gsheets-get-cells-formatted", GSheetGetCells(formatSheet));
}
