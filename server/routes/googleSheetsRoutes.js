const express = require('express');
const googleSheetsController = require('../controllers/googleSheetsController');
const processData = require('../utils/sheetProcessor');

const router = express.Router();

// Route to create and share Google Sheets and set up tracking
router.post('/create', googleSheetsController.createGoogleSheet);

// Route to receive Google Sheet change updates
router.post('/sheet-updates', googleSheetsController.receiveSheetUpdates);

// Route to manually process sheets.json and test formatting
router.post('/process-sheets', (req, res) => {
  try {
    const processedData = processData.processSheetsData(); // Manually process sheets.json
    res.status(200).send({ message: 'sheets.json processed successfully.', data: processedData });
  } catch (error) {
    res.status(500).send({ message: 'Error processing sheets.json', error: error.message });
  }
});

module.exports = router;
