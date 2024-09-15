const express = require('express');
const mySqlController = require('../controllers/mySqlController'); // Import from mySqlController
const logMiddleware = require('../middlewares/logMiddleware'); // Import logMiddleware

const router = express.Router();

// Middleware to check MySQL connection
const checkMySqlConncMiddleware = async (req, res, next) => {
  try {
    await mySqlController.checkMySqlConnc();
    next(); // Connection is successful, proceed to next middleware or route handler
  } catch (err) {
    res.status(500).send('Error connecting to MySQL.');
  }
};

// Example route to check if MySQL is running
router.get('/check', async (req, res) => {
  try {
    await mySqlController.checkMySqlConnc();
    res.send('MySQL connection is active.');
  } catch (err) {
    res.status(500).send('Error connecting to MySQL.');
  }
});

// Example route to create a table in MySQL, ensuring MySQL is running, with logging
router.post('/create-table', logMiddleware, checkMySqlConncMiddleware, async (req, res) => {
  try {
    const result = await mySqlController.createTable(req.body);
    res.send('Table created successfully.');
  } catch (err) {
    res.status(500).send('Error creating table.');
  }
});

// Example route to insert data into a MySQL table, with logging
router.post('/insert-data', logMiddleware, checkMySqlConncMiddleware, async (req, res) => {
  try {
    const result = await mySqlController.insertData(req.body.tableName, req.body.data);
    res.send('Data inserted successfully.');
  } catch (err) {
    res.status(500).send('Error inserting data.');
  }
});

module.exports = router;
