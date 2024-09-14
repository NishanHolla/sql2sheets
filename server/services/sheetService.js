const connection = require('../models/sheetModel');

function createTableFromConfig(config) {
  const tableName = config.table.name;
  const columns = config.table.columns.map(col => `${col.name} ${col.type}`).join(', ');

  const sql = `CREATE TABLE ${tableName} (${columns});`;
  connection.query(sql, (error, results) => {
    if (error) throw error;
    console.log('Table created successfully:', results);
  });
}

function insertDataIntoTable(tableName, data) {
  const columnNames = Object.keys(data);
  const numRows = data[columnNames[0]].length;
  const placeholders = columnNames.map(() => '?').join(',');
  const sql = `INSERT INTO ${tableName} (${columnNames.join(',')}) VALUES (${placeholders})`;

  for (let i = 0; i < numRows; i++) {
    const values = columnNames.map(col => data[col][i]);
    connection.query(sql, values, (error, results) => {
      if (error) throw error;
      console.log('Row inserted:', results);
    });
  }
}

module.exports = { createTableFromConfig, insertDataIntoTable };
