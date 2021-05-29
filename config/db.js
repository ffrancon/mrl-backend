const mongoose = require('mongoose');

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB, options);
    console.log('MongoDB Connected...');
  }  catch(err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
}

module.exports = connectDatabase;