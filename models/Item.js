const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    minLength: 2,
    unique: true,
  },
  measurementUnit: {
    type: String,
    trim: true,
    required: true,
    minLength: 2,
  },
  unitShortform: {
    type: String,
    trim: true,
    required: true,
    minLength: 1,
  },
});

const Item = mongoose.model('Item', ItemSchema);

module.exports = Item;
