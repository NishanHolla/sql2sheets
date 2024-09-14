const express = require('express');
const router = express.Router();
const syncService = require('../services/syncService');
const logMiddleware = require('../middlewares/logMiddleware');
const syncMiddleware = require('../middlewares/syncMiddleware');

router.post('/', logMiddleware, syncMiddleware, (req, res) => {
  const changes = req.body;

  syncService.syncWithGoogleSheets(changes, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: result });
  });
});

module.exports = router;
