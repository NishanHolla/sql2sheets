const fs = require('fs');
const path = require('path');

// Function to transform JSON data
function transformData(inputJson) {
  const sheetTitle = inputJson.sheet.title;
  const columns = inputJson.sheet.columns;

  // Initialize a 2D array for the sheet data
  const sheetData = [];

  // Add column headers as the first row
  sheetData.push(columns);

  // Add data rows for each column
  columns.forEach(column => {
    const columnData = inputJson.data[column];
    
    if (Array.isArray(columnData)) {
      // If the column data is an array, format each row accordingly
      columnData.forEach(item => {
        if (typeof item === 'object') {
          // Flatten the object data into a row format
          const row = columns.map(col => item[col] !== undefined ? item[col].toString() : '');
          sheetData.push(row);
        } else {
          // Handle case where data is a simple value (e.g., categories)
          const row = columns.map(col => col === column ? item : '');
          sheetData.push(row);
        }
      });
    }
  });

  return {
    sheet: {
      title: sheetTitle,
      columns: columns
    },
    data: sheetData
  };
}

// File paths
const inputFilePath = path.join(__dirname, './sheets.json');
const outputFilePath = path.join(__dirname, './sheets.json');

// Read the input JSON file
fs.readFile(inputFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading input file:', err);
    return;
  }

  let inputJson;
  try {
    inputJson = JSON.parse(data);
  } catch (parseError) {
    console.error('Error parsing JSON data:', parseError);
    return;
  }

  // Transform the data
  const transformedData = transformData(inputJson);

  // Write the transformed data to the output file
  fs.writeFile(outputFilePath, JSON.stringify(transformedData, null, 2), 'utf8', (writeErr) => {
    if (writeErr) {
      console.error('Error writing output file:', writeErr);
      return;
    }
    console.log('Data transformed and saved successfully.');
  });
});
