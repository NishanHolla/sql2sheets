const express = require('express');
const { createTable, insertData } = require('../controllers/mysqlController');
const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    await createTable();
    res.send('Table created.');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/insert', async (req, res) => {
  try {
    await insertData(req.body.data);
    res.send('Data inserted.');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
