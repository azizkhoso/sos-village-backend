/* eslint-disable no-underscore-dangle */
/* eslint-disable no-await-in-loop */
const express = require('express');
const House = require('../../../models/House');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const houses = await House.find({});
    res.json({ houses });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/:_id', async (req, res) => {
  try {
    const house = await House.findById(req.params._id);
    res.json({ house });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/new-house', async (req, res) => {
  try {
    const house = await House.create(req.body);
    res.json({ house });
  } catch (e) {
    if (e.code === 11000) res.status(500).json({ error: 'House already exists' });
    else res.status(500).json({ error: e.message });
  }
});

module.exports = router;
