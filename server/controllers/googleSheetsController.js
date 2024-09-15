const { google } = require('googleapis');
const ChangeLog = require('../models/changeLogModel'); // Your MongoDB model
const serviceAccount = require('../superjoin-sheets.json'); // Replace with your actual path

const auth = new google.auth.GoogleAuth({
  credentials: serviceAccount,
  scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/script.projects'],
});

const sheets = google.sheets({ version: 'v4', auth });
const drive = google.drive({ version: 'v3', auth });
const script = google.script({ version: 'v1', auth }); // Add Google Apps Script API

// Function to create a new Google Sheet and deploy Apps Script
exports.createGoogleSheet = async (req, res) => {
  try {
    // Create the new Google Sheet
    const response = await sheets.spreadsheets.create({
      resource: {
        properties: {
          title: 'Programmatically Created Sheet from Node.js',
        },
      },
    });

    const spreadsheetId = response.data.spreadsheetId;
    console.log(`Spreadsheet created with ID: ${spreadsheetId}`);

    // Share the sheet with hollanishan@gmail.com
    await this.shareGoogleSheet(spreadsheetId, 'hollanishan@gmail.com');

    // Deploy the Google Apps Script to track changes
    await this.deployAppsScript(spreadsheetId);

    res.status(200).send(`Spreadsheet created, shared with hollanishan@gmail.com, and triggers set up.`);
  } catch (error) {
    console.error('Error creating or sharing the Google Sheet:', error);
    res.status(500).send('Failed to create or share the Google Sheet.');
  }
};

// Function to share the Google Sheet
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

// Function to deploy Apps Script to track changes
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

    const createResponse = await script.projects.create({
      resource: {
        title: 'TrackSheetChanges',
        parentId: spreadsheetId,
      },
    });

    const scriptId = createResponse.data.scriptId;
    console.log(`Apps Script created with ID: ${scriptId}`);

    await script.projects.updateContent({
      scriptId,
      resource: {
        files: [
          {
            name: 'Code',
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

// Handle receiving sheet updates and store them in MongoDB
exports.receiveSheetUpdates = async (req, res) => {
  try {
    const changeLog = req.body;

    // Insert the change log into the MongoDB database
    await ChangeLog.create(changeLog);

    res.status(200).send('Change log received and stored.');
  } catch (error) {
    console.error('Error receiving change log:', error);
    res.status(500).send('Error processing change log.');
  }
};
