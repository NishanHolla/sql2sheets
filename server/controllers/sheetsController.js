const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const serviceAccount = require('../superjoin-sheets.json'); // Your Google service account credentials

const auth = new google.auth.GoogleAuth({
  credentials: serviceAccount,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Function to upload data from sheets.json to Google Sheets
exports.uploadSheetFromJSON = async (req, res) => {
  try {
    // Read the sheets.json file
    const sheetsFilePath = path.join(__dirname, '../uploads/sheets.json');
    const sheetData = JSON.parse(fs.readFileSync(sheetsFilePath, 'utf8'));

    // Create a new Google Sheet
    const response = await sheets.spreadsheets.create({
      resource: {
        properties: {
          title: sheetData.sheet.title,
        },
        sheets: [
          {
            properties: {
              title: sheetData.sheet.title,
            },
            data: [
              {
                rowData: [
                  {
                    values: sheetData.sheet.columns.map(col => ({
                      userEnteredValue: { stringValue: col },
                    })),
                  },
                  ...sheetData.data[sheetData.sheet.columns[0]].map((_, rowIndex) => ({
                    values: sheetData.sheet.columns.map(col => ({
                      userEnteredValue: { stringValue: sheetData.data[col][rowIndex] },
                    })),
                  })),
                ],
              },
            ],
          },
        ],
      },
    });

    const spreadsheetId = response.data.spreadsheetId;
    console.log(`Spreadsheet created with ID: ${spreadsheetId}`);
    res.status(200).send(`Spreadsheet created successfully with ID: ${spreadsheetId}`);
  } catch (error) {
    console.error('Error uploading the sheet:', error);
    res.status(500).send('Error uploading the sheet');
  }
};
