const express = require('express');
const app = express();

const connectDatabase = require('./config/db');

// Connect Database
connectDatabase();
 
app.get('/', (req, res) => {
  res.send('OK');
});

// Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});