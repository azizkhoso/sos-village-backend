const mongoose = require('mongoose');
const nanoid = require('nanoid');

const TestSchema = mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
    minLength: 4,
  },
  subject: {
    type: String,
    trim: true,
    required: true,
  },
  startsAt: {
    type: Date,
    required: true,
    min: new Date(),
  },
  qualification: {
    type: String,
    trim: true,
    required: true,
    minLength: 1,
  },
  isDemo: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: String,
    required: true,
    default: 'admin',
    trim: true,
  },
  questions: {
    type: [
      new mongoose.Schema({
        type: {
          type: String,
          trim: true,
          required: true,
          enum: ['MCQS', 'Blank', 'TrueFalse'],
        },
        id: {
          type: String,
          trim: true,
          required: true,
          default: nanoid(11),
        },
        statement: {
          type: String,
          trim: true,
          required: true,
          minLength: 3,
        },
        image: {
          type: String,
          trim: true,
        },
        answer: {
          type: String,
          trim: true,
          required: true,
          minLength: 1,
        },
        duration: {
          type: Number,
          required: true,
          min: 5,
          max: 180,
        },
        A: {
          type: String,
          minLength: 1,
        },
        B: {
          type: String,
          minLength: 1,
        },
        C: {
          type: String,
          minLength: 1,
        },
        D: {
          type: String,
          minLength: 1,
        },
      }),
    ],
    required: true,
    minLength: 3,
  },
});

const Test = mongoose.model('Test', TestSchema);

module.exports = Test;
