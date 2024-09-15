const { createMySQLConnection } = require('../utils/mysqlSingleton'); // Make sure this path is correct

// Middleware to check if MySQL is running
function checkMySQLRunning(req, res, next) {
  const connection = createMySQLConnection(); // Use the singleton connection

  if (!connection) {
    return res.status(500).send('Failed to connect to MySQL.');
  }

  console.log('MySQL is running. Connected as ID:', connection.threadId);
  next();
}

module.exports = { checkMySQLRunning };
