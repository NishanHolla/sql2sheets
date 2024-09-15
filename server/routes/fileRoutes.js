const express = require('express');
const multer = require('multer');
const fileController = require('../controllers/fileController');
const logMiddleware = require('../middlewares/logMiddleware'); // Import logMiddleware
const { checkMySQLRunning } = require('../middlewares/mysqlMiddleware');

// Initialize multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// Define the upload route with MySQL check and logging middleware
router.post('/upload', logMiddleware, checkMySQLRunning, upload.single('file'), fileController.uploadFile);

module.exports = router;
