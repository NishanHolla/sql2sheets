const mongoose = require('mongoose');

const changeLogSchema = new mongoose.Schema({
  sheetName: String,
  row: Number,
  column: Number,
  newValue: String,
  timestamp: Date,
});

const ChangeLog = mongoose.model('ChangeLog', changeLogSchema);

module.exports = ChangeLog;
