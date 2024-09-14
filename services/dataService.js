const db = require('../models/dataModel');

// Function to handle database operations
const createRecord = (data, callback) => {
  const query = 'INSERT INTO your_table SET ?';
  db.query(query, data, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

const deleteRecord = (id, callback) => {
  const query = 'DELETE FROM your_table WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

const updateRecord = (id, data, callback) => {
  const query = 'UPDATE your_table SET ? WHERE id = ?';
  db.query(query, [data, id], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

module.exports = { createRecord, deleteRecord, updateRecord };
