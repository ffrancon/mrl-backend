const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  name: {
    type: String,
    require: true
  },
  author: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  }
});

module.exports = Book = mongoose.model('book', BookSchema);