const express = require('express');
const multer = require('multer');
const { saveTransformedData } = require('./utils/transformData');

// Initialize Express
const app = express();
const port = 3000;

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Endpoint to handle JSON file upload
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // Process the uploaded file
  const inputJson = req.file.buffer.toString('utf8');

  try {
    // Save the transformed data to files
    saveTransformedData(inputJson);
    res.send('Files created successfully.');
  } catch (error) {
    res.status(500).send('Error processing the file.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
