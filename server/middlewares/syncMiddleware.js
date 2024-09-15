const { checkMySQLRunning } = require('./mysqlMiddleware');

// Middleware to sync MySQL and Google Sheets data, includes MySQL running check
function syncData(req, res, next) {
  // Example: Add more logic here if needed to sync data
  console.log('Running sync middleware...');

  // Check if MySQL is running before performing sync operations
  checkMySQLRunning(req, res, () => {
    // If MySQL is running, you can add more synchronization logic here
    console.log('Proceeding with data sync since MySQL is running.');
    next();
  });
}

module.exports = { syncData };
