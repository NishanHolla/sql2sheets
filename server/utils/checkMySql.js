const mysql = require('mysql');
const config = require('../config/config'); // Ensure this path is correct

// Create a MySQL connection using config from config.js
const connection = mysql.createConnection(config.mysqlConfig);

// Function to check MySQL connection
function checkMySQL() {
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err.stack);
      process.exit(1); // Exit the process with an error code
    }
    console.log('Connected to MySQL as ID:', connection.threadId);
    connection.end(); // Close the connection after checking
    process.exit(0); // Exit the process successfully
  });
}

// Run the function
checkMySQL();
