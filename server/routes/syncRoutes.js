const express = require('express');
const { syncData } = require('../middlewares/syncMiddleware');
const syncController = require('../controllers/syncController');
const logMiddleware = require('../middlewares/logMiddleware'); // Import logMiddleware

const router = express.Router();

// Sync route that logs requests
router.post('/sync', logMiddleware, syncData, syncController.performSync);

module.exports = router;
