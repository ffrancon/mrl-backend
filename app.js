const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const connectDatabase = require('./config/db');

// Connect Database
connectDatabase();

// Init middleware
app.use(express.json({ extended: false }));
 
app.get('/', (req, res) => {
  res.send('OK');
});

// Define routes
app.use('/api/users', require('./users/users.route'));
app.use('/api/auth', require('./auth/auth.route'));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});