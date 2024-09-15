const mysql = require('mysql');
const config = require('../config/config');

let connection = null; // Singleton connection

// Function to create a MySQL connection and reuse it
function createMySQLConnection() {
  if (!connection) {
    connection = mysql.createConnection(config.mysqlConfig);
    connection.connect((err) => {
      if (err) {
        console.error('Error connecting to MySQL:', err.stack);
      } else {
        console.log('Connected to MySQL as ID:', connection.threadId);
      }
    });

    // Handle connection errors and reconnect if needed
    connection.on('error', (err) => {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('MySQL connection lost. Reconnecting...');
        connection = null;
        createMySQLConnection(); // Reconnect
      } else {
        throw err;
      }
    });
  }

  return connection;
}

module.exports = { createMySQLConnection }; // Export the function
