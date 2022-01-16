const express = require('express');
const Test = require('../../models/test');

const router = express.Router();

router.get('/tests', async (req, res) => {
  try {
    const tests = await Test.find({ qualification: req.student.qualification }).select('-questions');
    res.json({ tests });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
