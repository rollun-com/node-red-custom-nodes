const { getGSheet, parseGSheetUrl } = require('./utils');
const { getTypedFieldValue } = require('../node-red-contrib-common-utils/1-global-utils')

module.exports = function (RED) {
  function GSheetUpdateRow(config) {
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
      if (!config.rowIndex) return makeError(`cells is required!`);
      if (!config.rowData) return makeError(`rowData is required`);

      const sheetURL = getTypedFieldValue(msg, config.sheetURL);
      const rowIndex = getTypedFieldValue(msg, config.rowIndex);
      const rowData = getTypedFieldValue(msg, config.rowData);

      if (!(typeof rowData === 'object' && rowData !== null && Object.keys(rowData).length > 0)) {
        return makeError(`rowData must be non empty object`);
      }

      try {
        const { sheetId, tableId } = parseGSheetUrl(sheetURL);
        const sheet = await getGSheet(sheetId, tableId, node.config.creds);

        const [row] = await sheet.getRows({ offset: +rowIndex - 2, limit: 1 });

        const notFoundKeys = Object.keys(rowData).filter(key => !(key in row));
        if (notFoundKeys.length > 0) {
          throw new Error(`fields [${notFoundKeys}], where not found in row with index ${rowIndex}. Available field values: ${row._sheet.headerValues}`);
        }

        Object.entries(rowData).forEach(([key, value]) => row[key] = value);
        await row.save();

        node.send([null, msg]);
      } catch (err) {
        msg.payload = { error: err.stack };
        node.send([msg, null]);
      }
    });
  }

  RED.nodes.registerType("gsheets-update-row", GSheetUpdateRow);
}
