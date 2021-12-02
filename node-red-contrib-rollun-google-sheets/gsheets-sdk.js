const joi = require('joi');
const { gSheetToRows } = require('./utils');
const { getGSheet } = require('./sdk');
const { parseGSheetUrl, columnToLetter } = require('./utils');
const {
  resolvePayload,
  validateObjectSchema,
  getTypedFieldValue
} = require('../node-red-contrib-common-utils/1-global-utils');

const actionsPayloadSchema = {
  getCells: joi.object({
    cells: joi.string().required(),
    formatResult: joi.boolean().default(false),
  }),
  updateRow: joi.object({
    rowIndex: joi.number().min(2).required(),
    rowData: joi.object(),
  }),
  appendRow: joi.object({
    rowData: joi.object(),
  }),
};

function validateHeadersInData(headers, data) {
  const notFoundKeys = Object.keys(data).filter(key => !headers.includes(key));
  if (notFoundKeys.length > 0) {
    throw new Error(`fields [${notFoundKeys}]are not valid. Available field values: ${headers}`);
  }
}

const handlers = {
  getCells: async function (creds, { sheetId, tableId }, { cells, formatResult }) {
    const sheet = await getGSheet(
      sheetId,
      tableId,
      creds,
      { loadCells: cells }
    );
    await sheet.loadHeaderRow()

    return formatResult ? gSheetToRows(sheet) : sheet;
  },
  updateRow: async function (creds, { sheetId, tableId }, { rowIndex, rowData }) {
    const sheet = await getGSheet(sheetId, tableId, creds);

    await sheet.loadHeaderRow()
    const headers = sheet.headerValues;

    validateHeadersInData(headers, rowData);

    const newRowAddress = `A${rowIndex}:${columnToLetter(headers.length)}${rowIndex}`;
    await sheet.loadCells(newRowAddress);

    // generate new row
    headers.forEach((header, idx) => {
      if (rowData[header]) {
        sheet.getCell(rowIndex - 1, idx).value = rowData[header]
      }
    });

    await sheet.saveUpdatedCells();
  },
  appendRow: async function (creds, { sheetId, tableId }, { rowData }) {
    const sheet = await getGSheet(sheetId, tableId, creds);

    await sheet.loadHeaderRow()
    const headers = sheet.headerValues;

    validateHeadersInData(headers, rowData);


    const { _rowNumber, _sheet, _rawData, ...row } = await sheet.addRow(rowData);
    return { rowNumber: _rowNumber, row };
  }
}

module.exports = function (RED) {
  function GSheetSDK(config) {
    const node = this;
    RED.nodes.createNode(node, config);
    node.config = RED.nodes.getNode(config.config);

    node.on('input', async function (msg) {
      const resolved = resolvePayload(msg, config.payload);
      const error = validateObjectSchema(actionsPayloadSchema[config.action], resolved)
      if (error) {
        msg.payload = { error };
        node.send([msg, null]);
        return;
      }
      try {
        const sheetURL = getTypedFieldValue(msg, config.sheetURL);

        const result = await handlers[config.action](
          node.config.creds,
          parseGSheetUrl(sheetURL),
          resolved,
        );
        if (result) {
          msg.payload = result;
        }
        node.send([null, msg]);
      } catch (e) {
        console.log(e);
        msg.payload = { error: e.message };
        node.send([msg, null]);
      }
    })
  }

  RED.nodes.registerType("gsheets-sdk", GSheetSDK);
}
