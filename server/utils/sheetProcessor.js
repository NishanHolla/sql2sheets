const fs = require('fs');
const path = require('path');

// Function to process sheets.json and overwrite it with the expected format for Google Sheets
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

module.exports = { processSheetsData };
