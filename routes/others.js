const express = require('express');
const Test = require('../models/test');

const router = express.Router();

router.get('/demo-tests', async (req, res) => {
  const { query } = req;
  try {
    const demoTests = await Test.find({
      isDemo: true,
      ...query,
    });
    res.json({ demoTests });
  } catch (e) {
    res.status(e.status).json({ error: e.message });
  }
});

module.exports = router;
