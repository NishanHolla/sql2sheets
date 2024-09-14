const mysql = require('mysql');
const { mysqlConfig } = require('../config');

const connection = mysql.createConnection(mysqlConfig);

async function createTable(tableInfo) {
  const columns = [
    'id INT AUTO_INCREMENT PRIMARY KEY',
    'name VARCHAR(255) NOT NULL',
    'value VARCHAR(255)'
  ].join(', ');
  
  const query = `CREATE TABLE IF NOT EXISTS ${tableInfo.name} (${columns})`;
  return new Promise((resolve, reject) => {
    connection.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

async function insertData(tableName, data) {
  const query = `INSERT INTO ${tableName} (name, value) VALUES ?`;
  const values = data.Name.map((name, index) => [name, data.Value[index]]);
  return new Promise((resolve, reject) => {
    connection.query(query, [values], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

module.exports = { createTable, insertData };
