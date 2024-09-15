const mysql = require('mysql');
const { mysqlConfig } = require('../config/config');

let connection;

function createConnection() {
  connection = mysql.createConnection(mysqlConfig);
  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return reject(err);
      }
      console.log('Connected to MySQL as ID:', connection.threadId);
      resolve(connection);
    });
  });
}

async function getConnection() {
  if (!connection) {
    await createConnection();
  }
  return connection;
}

module.exports = { getConnection };
