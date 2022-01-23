const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  testId: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  submittedBy: {
    type: String,
    trim: true,
    required: true,
  },
  answers: {
    type: [
      new mongoose.Schema({
        questionId: {
          type: String,
          required: true,
          trim: true,
        },
        answer: {
          type: String,
          required: true,
          trim: true,
          default: '',
        },
      }),
    ],
    required: true,
  },
});

const Submission = mongoose.model('Submission', SubmissionSchema);

module.exports = Submission;
