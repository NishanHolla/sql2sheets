const fs = require('fs');

// Function to transform input JSON to sheets and SQL formats
function transformData(inputJson) {
  const jsonData = JSON.parse(inputJson);

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

  return {
    sheetsFormat,
    sqlFormat
  };
}

// Function to save the transformed data to files
function saveTransformedData(inputJson) {
  const { sheetsFormat, sqlFormat } = transformData(inputJson);

  fs.writeFileSync('sheets.json', JSON.stringify(sheetsFormat, null, 2), 'utf8');
  fs.writeFileSync('sql.json', JSON.stringify(sqlFormat, null, 2), 'utf8');
}

module.exports = { saveTransformedData };
