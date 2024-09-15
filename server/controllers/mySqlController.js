const fs = require('fs');
const path = require('path');
const mysqlSingleton = require('../utils/mysqlSingleton'); // Adjust the path to your singleton file

// Function to check MySQL connection
async function checkMySqlConnc() {
  return new Promise((resolve, reject) => {
    const connection = mysqlSingleton.createMySQLConnection();
    connection.query('SELECT 1', (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

// Function to create or overwrite a table
async function createOrOverwriteTable(tableInfo) {
  return new Promise((resolve, reject) => {
    const connection = mysqlSingleton.createMySQLConnection();
    const dropTableQuery = `DROP TABLE IF EXISTS ${tableInfo.name}`;
    const createTableQuery = `CREATE TABLE ${tableInfo.name} (${tableInfo.columns.map(col => `${col.name} ${col.type}`).join(', ')})`;

    connection.query(dropTableQuery, (err) => {
      if (err) return reject(err);

      connection.query(createTableQuery, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  });
}

// Function to insert data into a table
async function insertData(tableName, data) {
  return new Promise((resolve, reject) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return reject(new Error('No valid data to insert'));
    }

    const columns = Object.keys(data[0] || {});
    if (columns.length === 0) {
      return reject(new Error('Data is not in the expected format'));
    }

    const values = data.map(row => columns.map(col => row[col]));
    const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES ?`;

    const connection = mysqlSingleton.createMySQLConnection();
    connection.query(query, [values], (err, results) => {
      if (err) {
        console.error('Error inserting data:', err);
        return reject(err);
      }
      resolve(results);
    });
  });
}

// Function to get all data from a table
async function getAllDataFromTable(tableName) {
  return new Promise((resolve, reject) => {
    const connection = mysqlSingleton.createMySQLConnection();
    const query = `SELECT * FROM ${tableName}`;

    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching data:', err);
        return reject(err);
      }
      resolve(results);
    });
  });
}

// Function to read the sql.json file and process the data
async function processSqlJsonFile() {
  const filePath = path.join(__dirname, '../uploads/sql.json');

  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', async (err, data) => {
      if (err) {
        console.error('Error reading sql.json file:', err);
        return reject(err);
      }
      try {
        const jsonData = JSON.parse(data);
        
        // Assuming sql.json has structure like:
        // { "table": { "name": "tableName", "columns": [{ "name": "columnName", "type": "columnType" }] }, "data": [ { "columnName": "value1" }, ... ] }

        const tableInfo = jsonData.table;
        const tableData = jsonData.data;

        // Step 1: Create or overwrite table
        await createOrOverwriteTable(tableInfo);
        console.log(`Table ${tableInfo.name} created or overwritten successfully`);

        // Step 2: Insert data into the table
        if (tableData && tableData.length > 0) {
          await insertData(tableInfo.name, tableData);
          console.log(`Data inserted into ${tableInfo.name} successfully`);
        } else {
          console.log(`No data found to insert into ${tableInfo.name}`);
        }

        resolve('Process completed successfully');
      } catch (parseErr) {
        console.error('Error parsing sql.json file:', parseErr);
        reject(parseErr);
      }
    });
  });
}

module.exports = { checkMySqlConnc, createOrOverwriteTable, insertData, getAllDataFromTable, processSqlJsonFile };

