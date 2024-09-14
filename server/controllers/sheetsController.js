const { google } = require('googleapis');
const { googleSheetsConfig } = require('../config');
const sheets = google.sheets({ version: 'v4', auth: googleSheetsConfig.auth });

async function createSheet(title) {
  const response = await sheets.spreadsheets.create({
    resource: {
      properties: { title }
    }
  });
  return response.data.spreadsheetId;
}

async function populateSheet(sheetId, data) {
  const values = [
    ['Name', 'Value'], // Headers
    ...data.Name.map((name, index) => [name, data.Value[index]]) // Rows
  ];
  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: 'Sheet1!A1',
    valueInputOption: 'RAW',
    resource: { values }
  });
}

module.exports = { createSheet, populateSheet };
