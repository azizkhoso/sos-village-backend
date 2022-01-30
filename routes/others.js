/* eslint-disable no-underscore-dangle */
const express = require('express');
const Test = require('../models/test');
const StatusMessageError = require('../others/StatusMessageError');

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

router.get('/demo-tests/:_id', async (req, res) => {
  try {
    const result = await Test.findOne({ _id: req.params._id });
    if (!result) throw new StatusMessageError('Test not found', 404);
    res.json({ demoTest: result._doc });
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
});

module.exports = router;
