const express = require('express');
const Test = require('../models/test');

const router = express.Router();

router.get('/demo-tests', async (req, res) => {
  try {
    const demoTests = await Test.find({
      isDemo: true,
      subject: req.body.subject,
      qualification: req.body.qualification,
    });
    res.json({ demoTests });
  } catch (e) {
    res.status(e.status).json({ error: e.message });
  }
});

module.exports = router;
