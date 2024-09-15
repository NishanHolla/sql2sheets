const express = require('express');
const multer = require('multer');
const fileController = require('../controllers/fileController');
const logMiddleware = require('../middlewares/logMiddleware');
const { checkMySQLRunning } = require('../middlewares/mysqlMiddleware');

// Initialize multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// Define the upload route with MySQL check and logging middleware
router.post('/upload', logMiddleware, checkMySQLRunning, upload.single('file'), (req, res, next) => {
  if (!req.file) {
    console.log('Multer failed to capture the file'); // Log for debugging
    return res.status(400).send('No file uploaded.');
  }

  console.log('Multer successfully captured the file:', req.file.originalname); // Log the file
  next();
}, fileController.uploadFile);

module.exports = router;
