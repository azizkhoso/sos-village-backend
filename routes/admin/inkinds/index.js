const express = require('express');
const Item = require('../../../models/Item');
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
    const item = await Item.findById(req.body.item);
    if (!item || !item._doc) throw new Error('Item not found');
    const inkind = await Inkind.create(req.body);
    await Item.findByIdAndUpdate(
      item._doc._id,
      {
        $inc: {
          remainingQuantity: Number(req.body.quantityReceived),
        },
      },
    );
    res.json({ inkind });
  } catch (e) {
    if (e.code === 11000) res.status(400).json({ error: 'Inkind already exists' });
    else res.status(500).json({ error: e.message });
  }
});

router.get('/:_id', async (req, res) => {
  try {
    const receipt = await Inkind.findById(req.params._id).populate('item').exec();
    res.json({ receipt });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/:_id', async (req, res) => {
  try {
    const item = await Item.findById(req.body.item);
    if (!item || !item._doc) throw new Error('Item not found');
    const old = await Inkind.findById(req.params._id);
    const inkind = await Inkind.findByIdAndUpdate(
      req.params._id,
      { ...req.body, _id: undefined },
    );
    await Item.findByIdAndUpdate(
      item._doc._id,
      {
        $set: {
          remainingQuantity:
            item._doc.remainingQuantity
            + Number(req.body.quantityReceived)
            - old._doc.quantityReceived,
        },
      },
    );
    res.json({ inkind });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:_id', async (req, res) => {
  try {
    const inkind = await Inkind.findByIdAndRemove(req.params._id, { new: true });
    await Item.findByIdAndUpdate(
      inkind._doc.item,
      {
        $inc: {
          remainingQuantity: -1 * inkind._doc.quantityReceived, // negative value is subtracted
        },
      },
    );
    res.json({ inkind });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
