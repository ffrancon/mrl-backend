const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  category: {
    type: String,
    required: true
  }
});

module.exports = List = mongoose.model('list', ListSchema);