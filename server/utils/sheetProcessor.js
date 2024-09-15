const fs = require('fs');
const path = require('path');

function processSheetsData() {
    const sheetsFilePath = path.join(__dirname, '../uploads/sheets.json');
    
    if (!fs.existsSync(sheetsFilePath)) {
      throw new Error('sheets.json not found.');
    }

    const sheetData = JSON.parse(fs.readFileSync(sheetsFilePath, 'utf8'));

    // Validate the structure
    if (!sheetData.Name || !sheetData.Value) {
      throw new Error('Invalid JSON structure. Expected "Name" and "Value" arrays.');
    }

    // Ensure Name and Value arrays are of the same length
    if (sheetData.Name.length !== sheetData.Value.length) {
      throw new Error('The "Name" and "Value" arrays must be of the same length.');
    }

    // Flatten the data into rows
    const rows = sheetData.Name.map((name, index) => {
      return [
        name,                          // Name
        sheetData.Value[index]          // Value
      ];
    });

    const processedData = {
      sheet: {
        title: 'Processed Sheet', // Title for the new sheet
        columns: ["Name", "Value"] // Column headers
      },
      data: rows
    };

    // Overwrite sheets.json with the processed data
    fs.writeFileSync(sheetsFilePath, JSON.stringify(processedData, null, 2), 'utf8');
    console.log('sheets.json has been processed and flattened.');

    return processedData;
}

module.exports = processSheetsData;
