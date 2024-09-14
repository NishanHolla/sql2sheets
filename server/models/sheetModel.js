const mysql = require('mysql');
const dbConfig = require('../config/dbConfig');

const connection = mysql.createConnection(dbConfig);

connection.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

module.exports = connection;
