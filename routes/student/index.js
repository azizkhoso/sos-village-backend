/* eslint-disable no-underscore-dangle */
const express = require('express');
const Test = require('../../models/test');
const StatusMessageError = require('../../others/StatusMessageError');

const router = express.Router();

router.get('/tests', async (req, res) => {
  try {
    const tests = await Test.find({ qualification: req.student.qualification }).select('-questions');
    res.json({ tests });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/tests/:_id', async (req, res) => {
  try {
    const result = await Test.findOne({ _id: req.params._id });
    if (!result) throw new StatusMessageError('Test not found', 404);
    res.json({ test: result._doc });
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
});

module.exports = router;
