const mysql = require('mysql');
const { saveTransformedData } = require('../utils/transformData');
const config = require('../config/config'); // Import MySQL config

// Create a MySQL connection pool using config from config.js
const pool = mysql.createPool(config.mysqlConfig);

// Middleware to check MySQL connection
exports.checkMySQLConnection = (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL:', err.stack);
      return res.status(500).send('Error connecting to MySQL.');
    }
    console.log('Connected to MySQL as ID:', connection.threadId);
    connection.release(); // Release the connection back to the pool
    next();
  });
};

// Controller to handle file upload and processing
exports.uploadFile = (req, res) => {
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
};
