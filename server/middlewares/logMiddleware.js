const Log = require('../models/logModel');

const logMiddleware = (req, res, next) => {
  const start = Date.now();

  // Capture the original send method
  const originalSend = res.send;

  res.send = function (body) {
    const duration = Date.now() - start;

    const logEntry = new Log({
      endpoint: req.originalUrl,
      method: req.method,
      requestBody: req.body,
      responseBody: body,
      status: res.statusCode
    });

    // Use async/await or promises for saving the log entry
    logEntry.save()
      .then(() => {
        console.log('Request logged successfully');
      })
      .catch((err) => {
        console.error('Error logging request:', err);
      });

    // Call the original send method
    originalSend.apply(res, arguments);
  };

  next();
};

module.exports = logMiddleware;
