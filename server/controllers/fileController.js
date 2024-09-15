const fs = require('fs');

// Controller to handle file upload and processing
exports.uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  console.log('File uploaded successfully:', req.file.originalname); // Debugging log

  // Process the uploaded file
  const inputJson = req.file.buffer.toString('utf8');

  try {
    // Save the transformed data to files
    const { sheetsFormat, sqlFormat } = transformData(inputJson);

    fs.writeFileSync('sheets.json', JSON.stringify(sheetsFormat, null, 2), 'utf8');
    fs.writeFileSync('sql.json', JSON.stringify(sqlFormat, null, 2), 'utf8');

    res.send('Files created successfully.');
  } catch (error) {
    console.error('Error processing the file:', error);
    res.status(500).send('Error processing the file.');
  }
};

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
