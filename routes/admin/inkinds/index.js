const express = require('express');
const Inkind = require('../../../models/Inkind');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const inkinds = await Inkind.find({}).populate('item').sort('-date').exec();
    res.json({ inkinds });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const inkind = await Inkind.create(req.body);
    res.json({ inkind });
  } catch (e) {
    if (e.code === 11000) res.status(400).json({ error: 'Inkind already exists' });
    else res.status(500).json({ error: e.message });
  }
});

router.get('/:_id', async (req, res) => {
  try {
    const inkind = await Inkind.findById(req.params._id).populate('item').exec();
    res.json({ inkind });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/:_id', async (req, res) => {
  try {
    const inkind = await Inkind.findByIdAndUpdate(
      req.params._id,
      { ...req.body, _id: undefined },
    );
    res.json({ inkind });
  } catch (e) {
    if (e.code === 11000) res.status(400).json({ error: 'Inkind already exists' });
    else res.status(500).json({ error: e.message });
  }
});

router.delete('/:_id', async (req, res) => {
  try {
    const inkind = await Inkind.findByIdAndRemove(req.params._id, { new: true });
    res.json({ inkind });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
