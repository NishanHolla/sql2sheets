const fs = require('fs');

// Function to transform input JSON to sheets and SQL formats
function transformData(inputFilePath) {
  // Read the input JSON file
  fs.readFile(inputFilePath, 'utf8', (err, data) => {
    if (err) throw err;

    const jsonData = JSON.parse(data);
    
    // Convert JSON data to Google Sheets format
    const sheetsFormat = {
      "sheet": {
        "title": "New Sheet",
        "columns": Object.keys(jsonData) // Column names
      },
      "data": {
        "Name": jsonData["Name"],
        "Value": jsonData["Value"]
      }
    };

    // Convert JSON data to SQL format
    const sqlFormat = {
      "table": {
        "name": "new_table",
        "columns": [
          { "name": "id", "type": "INT AUTO_INCREMENT PRIMARY KEY" },
          { "name": "name", "type": "VARCHAR(255) NOT NULL" },
          { "name": "value", "type": "VARCHAR(255)" }
        ]
      },
      "data": {
        "Name": jsonData["Name"],
        "Value": jsonData["Value"]
      }
    };

    // Write the transformed data to sheets.json and sql.json
    fs.writeFile('sheets.json', JSON.stringify(sheetsFormat, null, 2), 'utf8', (err) => {
      if (err) throw err;
      console.log('sheets.json has been saved.');
    });

    fs.writeFile('sql.json', JSON.stringify(sqlFormat, null, 2), 'utf8', (err) => {
      if (err) throw err;
      console.log('sql.json has been saved.');
    });
  });
}

// Example usage
transformData('fake_data.json'); // Replace 'input.json' with the path to your input JSON file
