const express = require('express');
const { createSheet, populateSheet } = require('../controllers/sheetsController');
const router = express.Router();

router.post('/sync', async (req, res) => {
  try {
    const { sheet, data } = req.body;
    // Create Sheet
    const sheetId = await createSheet(sheet.title);
    // Populate Sheet
    await populateSheet(sheetId, data);
    res.json({ sheetId });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
