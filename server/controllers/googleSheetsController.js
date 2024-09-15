const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const ChangeLog = require('../models/changeLogModel'); // MongoDB model for storing change logs
const serviceAccount = require('../superjoin-sheets.json'); // Replace with your actual path to service account

// Google Auth setup
const auth = new google.auth.GoogleAuth({
  credentials: serviceAccount,
  scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/script.projects'],
});

// Initialize APIs
const sheets = google.sheets({ version: 'v4', auth });
const drive = google.drive({ version: 'v3', auth });
const script = google.script({ version: 'v1', auth }); // Google Apps Script API

// Function to process sheets.json and convert it into the expected format for Google Sheets
function processSheetsData() {
    // Path to sheets.json
    const sheetsFilePath = path.join(__dirname, '../uploads/sheets.json');
  
    // Check if sheets.json exists
    if (!fs.existsSync(sheetsFilePath)) {
      throw new Error('sheets.json not found.');
    }
  
    // Read the sheets.json file
    const sheetData = JSON.parse(fs.readFileSync(sheetsFilePath, 'utf8'));
  
    // Validate if the structure is as expected
    if (!sheetData.data || !sheetData.sheet.columns) {
      throw new Error('Invalid JSON structure. Expected "data" and "columns" within "sheet".');
    }
  
    // Dynamically generate the rows by mapping each entry in the "data" object to its corresponding columns
    const rows = [];
  
    sheetData.data[sheetData.sheet.columns[0]].forEach((_, rowIndex) => {
      const row = sheetData.sheet.columns.map(col => {
        return sheetData.data[col] && sheetData.data[col][rowIndex] !== undefined
          ? sheetData.data[col][rowIndex]
          : '';
      });
      rows.push(row);
    });
  
    // Create the processed format
    const processedData = {
      sheet: {
        title: sheetData.sheet.title || 'New Sheet',
        columns: sheetData.sheet.columns // Use the provided columns
      },
      data: rows // Flattened rows of data
    };
  
    // Overwrite the sheets.json file with the processed data
    fs.writeFileSync(sheetsFilePath, JSON.stringify(processedData, null, 2), 'utf8');
    console.log('sheets.json has been processed and overwritten with the expected format.');
  
    // Return the processed data to be used for creating the Google Sheet
    return processedData;
  }

// Function to create a new Google Sheet from sheets.json and deploy Apps Script
exports.createGoogleSheet = async (req, res) => {
  try {
    // First, process the sheets.json file to make sure it's in the correct format
    const processedSheetData = processSheetsData();

    // Path to sheets.json
    const sheetsFilePath = path.join(__dirname, '../uploads/sheets.json');
    
    // Check if sheets.json exists
    if (!fs.existsSync(sheetsFilePath)) {
      return res.status(400).send('sheets.json not found.');
    }

    // Create the new Google Sheet using the title and columns from processed sheets.json
    const response = await sheets.spreadsheets.create({
      resource: {
        properties: {
          title: processedSheetData.sheet.title, // Title from processed sheets.json
        },
        sheets: [
          {
            properties: {
              title: processedSheetData.sheet.title, // Set the sheet title
            },
            data: [
              {
                rowData: [
                  {
                    values: processedSheetData.sheet.columns.map(col => ({
                      userEnteredValue: { stringValue: col },
                    })),
                  },
                  ...processedSheetData.data.map(row => ({
                    values: row.map(cell => ({
                      userEnteredValue: { stringValue: cell.toString() },
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

    // Share the sheet with hollanishan@gmail.com
    await this.shareGoogleSheet(spreadsheetId, 'hollanishan@gmail.com');

    // Deploy the Google Apps Script to track changes
    await this.deployAppsScript(spreadsheetId);

    res.status(200).send(`Spreadsheet created from sheets.json, shared with hollanishan@gmail.com, and triggers set up.`);
  } catch (error) {
    console.error('Error creating or sharing the Google Sheet:', error);
    res.status(500).send('Failed to create or share the Google Sheet.');
  }
};

// Function to share the Google Sheet with a specific email
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

// Function to deploy Google Apps Script to track changes
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

    // Create the Apps Script project associated with the spreadsheet
    const createResponse = await script.projects.create({
      resource: {
        title: 'TrackSheetChanges',
        parentId: spreadsheetId,
      },
    });

    const scriptId = createResponse.data.scriptId;
    console.log(`Apps Script created with ID: ${scriptId}`);

    // Deploy the script to the project
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
