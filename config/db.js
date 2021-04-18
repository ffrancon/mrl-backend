const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

console.log(db);

const params = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}

const connectDatabase = async () => {
  try {
    await mongoose.connect(db, params);
    console.log('MongoDB Connected...');
  }  catch(err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
}

module.exports = connectDatabase;