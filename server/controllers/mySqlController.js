const { getConnection } = require('../utils/mySqlSingleton'); // Import the singleton connection

async function checkMySqlConnc() {
  try {
    const connection = await getConnection();
    console.log('Connected to MySQL as ID:', connection.threadId);
    return { message: 'MySQL connection is active.', id: connection.threadId };
  } catch (err) {
    throw new Error('Error connecting to MySQL.');
  }
}

async function createTable(tableInfo) {
  const connection = await getConnection();
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
  const connection = await getConnection();
  const query = `INSERT INTO ${tableName} (name, value) VALUES ?`;
  const values = data.Name.map((name, index) => [name, data.Value[index]]);
  return new Promise((resolve, reject) => {
    connection.query(query, [values], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

module.exports = { checkMySqlConnc, createTable, insertData };
