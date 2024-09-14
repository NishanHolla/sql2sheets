const fs = require('fs');
const path = require('path');

// Function to transform input JSON to sheets and SQL formats
function transformData(inputFilePath) {
  // Ensure input file path is provided
  if (!inputFilePath) {
    console.error('Please provide the path to the input JSON file.');
    process.exit(1);
  }

  // Resolve the absolute path
  const absolutePath = path.resolve(inputFilePath);

  // Read the input JSON file
  fs.readFile(absolutePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      process.exit(1);
    }

    const jsonData = JSON.parse(data);

    // Extract columns dynamically
    const columns = Object.keys(jsonData);

    // Convert JSON data to Google Sheets format
    const sheetsFormat = {
      "sheet": {
        "title": "New Sheet",
        "columns": columns // Column names
      },
      "data": jsonData // Directly include data
    };

    // Convert JSON data to SQL format
    const sqlColumns = columns.map((col, index) => {
      return {
        "name": col,
        "type": index === 0 ? "VARCHAR(255) NOT NULL" : "VARCHAR(255)" // Example types
      };
    });

    const sqlFormat = {
      "table": {
        "name": "new_table",
        "columns": [
          { "name": "id", "type": "INT AUTO_INCREMENT PRIMARY KEY" },
          ...sqlColumns
        ]
      },
      "data": jsonData
    };

    // Write the transformed data to sheets.json and sql.json
    fs.writeFile('sheets.json', JSON.stringify(sheetsFormat, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Error writing sheets.json:', err);
        process.exit(1);
      }
      console.log('sheets.json has been saved.');
    });

    fs.writeFile('sql.json', JSON.stringify(sqlFormat, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Error writing sql.json:', err);
        process.exit(1);
      }
      console.log('sql.json has been saved.');
    });
  });
}

// Get the input file path from command-line arguments
const inputFilePath = process.argv[2];
transformData(inputFilePath);
