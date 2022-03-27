const mongoose = require('mongoose');

const ReceiptSchema = mongoose.Schema({
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

const Receipt = mongoose.model('Receipt', ReceiptSchema);

module.exports = Receipt;
