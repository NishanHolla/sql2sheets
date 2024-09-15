const express = require('express');
const fileRoutes = require('./routes/fileRoutes');
const mySqlRoutes = require('./routes/mySqlRoutes');
const syncRoutes = require('./routes/syncRoutes');
const googleSheetsRoutes = require('./routes/googleSheetsRoutes'); // Import Google Sheets routes
const logMiddleware = require('./middlewares/logMiddleware'); // Import logMiddleware

const app = express();
const port = 3000;

// Middleware setup
app.use(express.json());

// Apply logMiddleware globally to log all routes
app.use(logMiddleware);

// Define the routes
app.use('/files', fileRoutes);
app.use('/mysql', mySqlRoutes);
app.use('/sync', syncRoutes);
app.use('/sheets', googleSheetsRoutes);  // Add the Google Sheets routes

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
