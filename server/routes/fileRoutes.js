const express = require('express');
const formidable = require('formidable');
const fileController = require('../controllers/fileController');

const router = express.Router();

// Define the upload route using formidable
router.post('/upload', (req, res) => {
  const form = new formidable.IncomingForm();
  
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Error parsing the file upload:', err);
      return res.status(500).send('File upload failed.');
    }

    console.log('Formidable parsed files:', files); // Log the files object for debugging

    // Pass the uploaded file path and other necessary info to the controller
    fileController.uploadFile(req, res, files.file); // Ensure `file` matches your field name in Postman
  });
});

module.exports = router;
