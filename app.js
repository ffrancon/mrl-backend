const express = require('express');
const app = express();

const connectDatabase = require('./config/db');

// Connect Database
connectDatabase();
 
app.get('/', (req, res) => {
  res.send('OK');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});