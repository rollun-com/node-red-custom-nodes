const { GoogleSpreadsheet } = require('google-spreadsheet');
const { URL } = require('url');

function parseGSheetUrl(url) {
  const parsedUrl = new URL(url);

  const sheetIdMatch = parsedUrl.pathname.match(/spreadsheets\/d\/(?<sheetId>.+)\//i);
  const tableIdMatch = parsedUrl.hash.match(/gid=(?<tableId>[0-9]+)/i);
  if (!sheetIdMatch) {
    throw new Error(`Could not get sheetId from url.`);
  }
  if (!tableIdMatch) {
    throw new Error(`Could not get tableId from url.`);
  }

  const { sheetId } = sheetIdMatch.groups;
  const { tableId } = tableIdMatch.groups;
  return { sheetId, tableId };
}

async function getGSheet(sheetId, tableId, creds, { loadCells } = {}) {
  const doc = new GoogleSpreadsheet(sheetId);

  await doc.useServiceAccountAuth(creds);

  await doc.loadInfo();
  const sheet = doc.sheetsById[tableId];
  if (!sheet) {
    throw new Error(`Google sheet with id ${tableId} not found!`);
  }
  if (loadCells) {
    await sheet.loadCells(loadCells);
  }
  return sheet;
}

function columnToLetter(column) {
  let temp, letter = '';
  while (column > 0)
  {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter;
}

module.exports = {
  parseGSheetUrl,
  getGSheet,
  columnToLetter,
}
