const mongoose = require('mongoose');

const RecordSchema = mongoose.Schema({
  house: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'House',
    required: true,
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },
  quantityIssued: {
    type: Number,
    required: true,
    min: 1,
  },
  issueDate: {
    type: Date,
    required: true,
    default: new Date(),
  },
  mother: {
    type: String,
    trim: true,
    required: true,
    minLength: 3,
  },
});

const Record = mongoose.model('Record', RecordSchema);

module.exports = Record;
