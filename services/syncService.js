const dataService = require('./dataService');
const Log = require('../models/logModel');

// Sync with Google Sheets
const syncWithGoogleSheets = (changes, callback) => {
  // Example processing changes
  const syncStartTime = new Date();
  
  changes.additions.forEach(record => {
    dataService.createRecord(record, (err, result) => {
      if (err) return callback(err);
      console.log('Record added:', result);
      logSync('POST', '/sync', { record }, { result }, 'success');
    });
  });

  changes.deletions.forEach(id => {
    dataService.deleteRecord(id, (err, result) => {
      if (err) return callback(err);
      console.log('Record deleted:', result);
      logSync('DELETE', '/sync', { id }, { result }, 'success');
    });
  });

  callback(null, 'Sync complete');
};

// Log Sync
const logSync = (method, endpoint, requestBody, responseBody, status) => {
  const logEntry = new Log({
    endpoint,
    method,
    requestBody,
    responseBody,
    status
  });

  logEntry.save((err) => {
    if (err) console.error('Error logging sync:', err);
  });
};

module.exports = { syncWithGoogleSheets };
