const express = require('express');
const googleSheetsController = require('../controllers/googleSheetsController');

const router = express.Router();

// Route to create and share Google Sheets
router.post('/create', googleSheetsController.createGoogleSheet);

module.exports = router;
