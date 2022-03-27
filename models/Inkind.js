const mongoose = require('mongoose');

const InkindSchema = mongoose.Schema({
  registeryNumber: {
    type: Number,
    required: true,
    min: 1,
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },
  quantityReceived: {
    type: Number,
    required: true,
    min: 1,
  },
  date: {
    type: Date,
    required: true,
    default: new Date(),
  },
});

const Inkind = mongoose.model('Inkind', InkindSchema);

module.exports = Inkind;
