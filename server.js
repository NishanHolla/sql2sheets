const express = require('express');
const bodyParser = require('body-parser');
const syncRoutes = require('./routes/syncRoutes');
const otherRoutes = require('./routes/otherRoutes');
const logMiddleware = require('./middlewares/logMiddleware');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(logMiddleware); // Apply log middleware globally

// Routes
app.use('/sync', syncRoutes);
app.use('/other', otherRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
