const mongoose = require('mongoose');

const HouseSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    minLength: 2,
    unique: true,
  },
  mother: {
    type: String,
    trim: true,
    required: true,
    minLength: 3,
  },
});

const House = mongoose.model('House', HouseSchema);

module.exports = House;
