const mongoose = require('mongoose');
const TableSheetMapping = require('../models/tableSheetMapping'); // MongoDB model

// Function to store metadata in MongoDB
exports.storeTableSheetMapping = async (req, res) => {
  try {
    const { tableName, sheetId } = req.body; // Expect tableName and sheetId to be sent in request body

    const newEntry = new TableSheetMapping({
      tableName,
      sheetId,
      createdAt: new Date(),
    });

    await newEntry.save();
    res.status(200).send('Table and Sheet mapping saved successfully.');
  } catch (error) {
    console.error('Error storing metadata in MongoDB:', error);
    res.status(500).send('Error storing metadata in MongoDB.');
  }
};
