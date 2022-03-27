const express = require('express');
const Record = require('../../../models/Record');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const records = await Record.find({})
      .populate('item')
      .populate('house')
      .sort('-issueDate')
      .exec();
    res.json({ records });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const record = await Record.create(req.body);
    res.json({ record });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/:_id', async (req, res) => {
  try {
    const record = await Record.findById(req.params._id).populate('item').populate('house').exec();
    res.json({ record });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/:_id', async (req, res) => {
  try {
    const record = await Record.findByIdAndUpdate(
      req.params._id,
      { ...req.body, _id: undefined },
    );
    res.json({ record });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:_id', async (req, res) => {
  try {
    const record = await Record.findByIdAndRemove(req.params._id, { new: true });
    res.json({ record });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
