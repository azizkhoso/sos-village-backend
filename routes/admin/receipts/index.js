const express = require('express');
const Item = require('../../../models/Item');
const Receipt = require('../../../models/Receipt');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const receipts = await Receipt.find({}).populate('item').sort('-date').exec();
    res.json({ receipts });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const item = await Item.findById(req.body.item);
    if (!item || !item._doc) throw new Error('Item not found');
    const receipt = await Receipt.create(req.body);
    await Item.findByIdAndUpdate(
      item._doc._id,
      {
        $inc: {
          remainingQuantity: Number(req.body.quantityReceived),
        },
      },
    );
    res.json({ receipt });
  } catch (e) {
    if (e.code === 11000) res.status(400).json({ error: 'Receipt already exists' });
    else res.status(500).json({ error: e.message });
  }
});

router.get('/:_id', async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params._id).populate('item').exec();
    res.json({ receipt });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/:_id', async (req, res) => {
  try {
    const item = await Item.findById(req.body.item);
    if (!item || !item._doc) throw new Error('Item not found');
    const old = await Receipt.findById(req.params._id);
    const receipt = await Receipt.findByIdAndUpdate(
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
    res.json({ receipt });
  } catch (e) {
    if (e.code === 11000) res.status(400).json({ error: 'Receipt already exists' });
    else res.status(500).json({ error: e.message });
  }
});

router.delete('/:_id', async (req, res) => {
  try {
    const receipt = await Receipt.findByIdAndRemove(req.params._id, { new: true });
    await Item.findByIdAndUpdate(
      receipt._doc.item,
      {
        $inc: {
          remainingQuantity: -1 * receipt._doc.quantityReceived, // negative value is subtracted
        },
      },
    );
    res.json({ receipt });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
