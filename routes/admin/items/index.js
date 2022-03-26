const express = require('express');
const Item = require('../../../models/Item');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await Item.find({});
    res.json({ items });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const item = await Item.create(req.body);
    res.json({ item });
  } catch (e) {
    if (e.code === 11000) res.status(400).json({ error: 'Item already exists' });
    else res.status(500).json({ error: e.message });
  }
});

router.get('/:_id', async (req, res) => {
  try {
    const item = await Item.findById(req.params._id);
    res.json({ item });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/:_id', async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params._id, { ...req.body, _id: undefined });
    res.json({ item });
  } catch (e) {
    if (e.code === 11000) res.status(400).json({ error: 'Item already exists' });
    else res.status(500).json({ error: e.message });
  }
});

router.delete('/:_id', async (req, res) => {
  try {
    const item = await Item.findByIdAndRemove(req.params._id, { new: true });
    res.json({ item });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
