const mongoose = require('mongoose');

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/logsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // Ensure you handle connection errors or provide appropriate options
});

const logSchema = new mongoose.Schema({
  endpoint: String,
  method: String,
  timestamp: { type: Date, default: Date.now },
  requestBody: Object,
  responseBody: Object,
  status: String
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
