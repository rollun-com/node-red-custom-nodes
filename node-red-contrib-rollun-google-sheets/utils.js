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

function columnToLetter(column) {
  let temp, letter = '';
  while (column > 0) {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter;
}

function formatGSheetToArray(sheet) {
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
}

/**
 * @param worksheet
 */
async function gSheetToRows(worksheet) {
  const rows = await worksheet.getRows();
  const cells = rows.map(row => row._rawData);
  const headers = worksheet.headerValues;

  return cells.reduce((acc, row) => {
    const formattedRow = {};
    headers.forEach((header, idx) => {
      formattedRow[header] = row[idx];
    })

    return acc.concat(formattedRow);
  }, []);
}

module.exports = {
  gSheetToRows,
  parseGSheetUrl,
  formatGSheetToArray,
  columnToLetter,
}
