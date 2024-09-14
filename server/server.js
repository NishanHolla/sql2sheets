const express = require('express');
const app = express();
const sheetsRoutes = require('./routes/sheetsRoutes');
const mysqlRoutes = require('./routes/mysqlRoutes');
const syncMiddleware = require('./middlewares/syncMiddleware');

app.use(express.json());
app.use(syncMiddleware);

app.use('/sheets', sheetsRoutes);
app.use('/mysql', mysqlRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
