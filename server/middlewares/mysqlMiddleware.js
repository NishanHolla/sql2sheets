// mysqlMiddleware.js
const mysql = require('mysql');
const config = require('../config/config');

// Middleware to check if MySQL is running
function checkMySQLRunning(req, res, next) {
  const connection = mysql.createConnection(config.mysqlConfig);

  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err.stack);
      return res.status(500).send('MySQL is not running.');
    }
    console.log('MySQL is running. Connected as ID:', connection.threadId);
    connection.end(); // Close the connection after checking
    next();
  });
}

module.exports = { checkMySQLRunning };
