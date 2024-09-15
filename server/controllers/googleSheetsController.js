const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const serviceAccount = require('../superjoin-sheetsv2.json');
const processSheetsData = require('../utils/sheetProcessor');
const ChangeLog = require('../models/changeLogModel');

const auth = new google.auth.GoogleAuth({
  credentials: serviceAccount,
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/script.projects'
  ],
});

const sheets = google.sheets({ version: 'v4', auth });
const drive = google.drive({ version: 'v3', auth });
const script = google.script({ version: 'v1', auth });

const sheetIdFilePath = path.join(__dirname, '../uploads/sheetId.json');

exports.createOrUpdateGoogleSheet = async (req, res) => {
    try {
      const sheetsFilePath = path.join(__dirname, '../uploads/sheets.json');
  
      if (!fs.existsSync(sheetsFilePath)) {
        return res.status(400).send('sheets.json not found.');
      }
  
      let processedSheetData;
      try {
        processedSheetData = JSON.parse(fs.readFileSync(sheetsFilePath, 'utf8'));
      } catch (error) {
        return res.status(400).send('Invalid JSON format in sheets.json.');
      }
  
      if (!processedSheetData.data || typeof processedSheetData.data !== 'object') {
        return res.status(400).send('Invalid format for sheet data.');
      }
  
      const columns = processedSheetData.sheet.columns;
      const data = processedSheetData.data;
  
      // Initialize rows with the column headers
      const rows = [columns];
  
      // Determine the maximum number of rows
      const maxRows = Math.max(...Object.values(data).map(arr => arr.length));
  
      // Populate rows with values
      for (let i = 0; i < maxRows; i++) {
        const row = columns.map(col => data[col][i] || ''); // Ensure all rows have values for all columns
        rows.push(row);
      }
  
      const processedData = {
        sheet: {
          title: processedSheetData.sheet.title || 'New Sheet',
          columns: columns
        },
        data: rows
      };
  
      let spreadsheetId;
      if (fs.existsSync(sheetIdFilePath)) {
        const sheetIdData = JSON.parse(fs.readFileSync(sheetIdFilePath, 'utf8'));
        spreadsheetId = sheetIdData.spreadsheetId;
        await exports.updateGoogleSheet(spreadsheetId, processedData);
        return res.status(200).send('Existing sheet updated.');
      } else {
        const response = await sheets.spreadsheets.create({
          resource: {
            properties: { title: processedData.sheet.title },
            sheets: [
              {
                properties: { title: processedData.sheet.title },
                data: [
                  {
                    rowData: rows.map(row => ({
                      values: row.map(cell => ({
                        userEnteredValue: { stringValue: cell.toString() },
                      })),
                    })),
                  },
                ],
              },
            ],
          },
        });
  
        spreadsheetId = response.data.spreadsheetId;
        console.log(`Spreadsheet created with ID: ${spreadsheetId}`);
  
        fs.writeFileSync(sheetIdFilePath, JSON.stringify({ spreadsheetId }));
  
        await exports.shareGoogleSheet(spreadsheetId, 'hollanishan@gmail.com');
        await exports.deployAppsScript(spreadsheetId);
  
        return res.status(200).send('Spreadsheet created and shared.');
      }
    } catch (error) {
      console.error('Error creating or updating the Google Sheet:', error);
      return res.status(500).send('Failed to create or update the Google Sheet.');
    }
  };
  

exports.updateGoogleSheet = async (spreadsheetId, processedSheetData) => {
  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${processedSheetData.sheet.title}!A1`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [
          processedSheetData.sheet.columns,
          ...processedSheetData.data,
        ],
      },
    });
    console.log(`Spreadsheet with ID ${spreadsheetId} updated.`);
  } catch (error) {
    console.error('Error updating the Google Sheet:', error);
    throw new Error('Failed to update the Google Sheet.');
  }
};

exports.shareGoogleSheet = async (spreadsheetId, email) => {
  try {
    await drive.permissions.create({
      resource: {
        type: 'user',
        role: 'writer',
        emailAddress: email,
      },
      fileId: spreadsheetId,
      fields: 'id',
    });

    console.log(`Spreadsheet shared with ${email}`);
  } catch (error) {
    console.error('Error sharing the Google Sheet:', error);
  }
};

exports.deployAppsScript = async (spreadsheetId) => {
  try {
    const scriptContent = `
      function onEdit(e) {
        const sheet = e.source.getActiveSheet();
        const range = e.range;
        const value = e.value;

        const data = {
          sheetName: sheet.getName(),
          row: range.getRow(),
          column: range.getColumn(),
          newValue: value,
          timestamp: new Date(),
        };

        const options = {
          method: 'POST',
          contentType: 'application/json',
          payload: JSON.stringify(data)
        };

        UrlFetchApp.fetch('https://your-node-server.com/sheet-updates', options);
      }
    `;

    await script.projects.createContent({
      scriptId: 'YOUR_SCRIPT_ID',
      resource: {
        files: [
          {
            name: 'Code.gs',
            type: 'SERVER_JS',
            source: scriptContent,
          },
        ],
      },
    });

    console.log(`Apps Script deployed to track changes on spreadsheet: ${spreadsheetId}`);
  } catch (error) {
    console.error('Error deploying Apps Script:', error);
  }
};

exports.receiveSheetUpdates = async (req, res) => {
  try {
    const changeLog = req.body;

    await ChangeLog.create(changeLog);

    res.status(200).send('Change log received and stored.');
  } catch (error) {
    console.error('Error receiving change log:', error);
    res.status(500).send('Error processing change log.');
  }
};
