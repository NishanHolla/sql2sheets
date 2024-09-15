const fs = require('fs');
const path = require('path');
const sqlController = require('./mySqlController'); // Assuming you have this for MySQL
const sheetController = require('./sheetsController'); // Assuming you have this for Google Sheets

// Controller to handle file upload, transformation, and sheet/table creation
exports.uploadFile = async (req, res, uploadedFiles) => {
  if (!uploadedFiles || uploadedFiles.length === 0) {
    return res.status(400).send('No file uploaded.');
  }

  const uploadedFile = Array.isArray(uploadedFiles) ? uploadedFiles[0] : uploadedFiles; // Handle array case

  console.log('File uploaded successfully:', uploadedFile.originalFilename);

  try {
    // Read the uploaded file content (using the correct path)
    const inputJson = fs.readFileSync(uploadedFile.filepath, 'utf8');

    // Transform the data (existing logic)
    const { sheetsFormat, sqlFormat } = transformData(inputJson);

    // Save the transformed data to files in the 'uploads/' directory
    fs.writeFileSync(path.join(__dirname, '../uploads', 'sheets.json'), JSON.stringify(sheetsFormat, null, 2), 'utf8');
    fs.writeFileSync(path.join(__dirname, '../uploads', 'sql.json'), JSON.stringify(sqlFormat, null, 2), 'utf8');

    // After transforming the data, create Google Sheet and MySQL table

    // 1. Create the Google Sheet
    await sheetController.uploadSheetFromJSON(req, res);  // Assuming this function uploads a Google Sheet from 'sheets.json'

    // 2. Create MySQL table and insert data
    await sqlController.createTableFromFile();  // Assuming this creates the table based on 'sql.json'
    await sqlController.insertDataFromFile();   // Assuming this inserts data from 'sql.json' into the newly created table

    res.status(200).send('Files created, Google Sheet uploaded, and MySQL table created successfully.');
  } catch (error) {
    console.error('Error processing the file:', error);
    res.status(500).send('Error processing the file.');
  }
};

// Your existing transformData function
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
