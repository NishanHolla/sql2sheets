const fs = require('fs');
const path = require('path');
const { getConnection } = require('../utils/mySqlSingleton'); // Import the singleton connection

// Function to check MySQL connection
async function checkMySqlConnc() {
  try {
    const connection = await getConnection();
    console.log('Connected to MySQL as ID:', connection.threadId);
    return { message: 'MySQL connection is active.', id: connection.threadId };
  } catch (err) {
    throw new Error('Error connecting to MySQL.');
  }
}

// Function to create a table using table information
async function createTableFromFile() {
  try {
    const sqlFilePath = path.join(__dirname, '../uploads/sql.json');
    const sqlData = JSON.parse(fs.readFileSync(sqlFilePath, 'utf8'));

    const connection = await getConnection();
    const columns = sqlData.table.columns
      .map(col => `${col.name} ${col.type}`)
      .join(', ');

    const query = `CREATE TABLE IF NOT EXISTS ${sqlData.table.name} (${columns})`;

    return new Promise((resolve, reject) => {
      connection.query(query, (err, results) => {
        if (err) return reject(err);
        console.log(`Table ${sqlData.table.name} created successfully.`);
        resolve(results);
      });
    });
  } catch (err) {
    throw new Error('Error creating table from file:', err);
  }
}

// Function to insert data into the table
async function insertDataFromFile() {
  try {
    const sqlFilePath = path.join(__dirname, '../uploads/sql.json');
    const sqlData = JSON.parse(fs.readFileSync(sqlFilePath, 'utf8'));

    const connection = await getConnection();
    const query = `INSERT INTO ${sqlData.table.name} (${sqlData.table.columns.map(col => col.name).join(', ')}) VALUES ?`;

    const dataRows = sqlData.data[sqlData.table.columns[0].name].map((_, index) =>
      sqlData.table.columns.map(col => sqlData.data[col.name][index])
    );

    return new Promise((resolve, reject) => {
      connection.query(query, [dataRows], (err, results) => {
        if (err) return reject(err);
        console.log(`Data inserted successfully into table ${sqlData.table.name}`);
        resolve(results);
      });
    });
  } catch (err) {
    throw new Error('Error inserting data from file:', err);
  }
}

module.exports = { checkMySqlConnc, createTableFromFile, insertDataFromFile };
