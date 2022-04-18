const express = require('express');

const Item = require('../../../models/Item');
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

router.get('/report/:houseId', async (req, res) => {
  try {
    const { query } = req;
    if (!query) throw new Error('Please supply query string with months and years');
    if (!query.month || !query.year) throw new Error('Month or year missing in query string');
    const startDate = `${Number(query.year)}-${Number(query.month)}-01`;
    const endDate = `${Number(query.year)}-${Number(query.month) + 1}-01`;
    const isoStartDate = new Date(startDate).toISOString();
    const isoEndDate = new Date(endDate).toISOString();
    const records = await Record.find(
      {
        house: req.params.houseId,
        issueDate: { $gte: isoStartDate, $lt: isoEndDate },
      },
    )
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
    const item = await Item.findById(req.body.item);
    if (!item || !item._doc) throw new Error('Item not found');
    if (Number(req.body.quantityIssued) > item._doc.remainingQuantity) {
      throw new Error(`You need ${Number(req.body.quantityIssued) - item._doc.remainingQuantity} ${item._doc.unitShortform} more to issue. Can not issue more than ${item._doc.remainingQuantity} ${item._doc.unitShortform}`);
    }
    const record = await Record.create(req.body);
    await Item.findByIdAndUpdate(
      item._doc._id,
      {
        $inc: {
          remainingQuantity: -1 * Number(req.body.quantityIssued),
        },
      },
    );
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
    const record = await Record.findById(req.params._id);
    if (!record || !record._doc) throw new Error('Record not found');
    const item = await Item.findById(record._doc.item);
    if (!item || !item._doc) throw new Error('Item not found');
    const totalQuantityBeforeUpdate = item._doc.remainingQuantity + record._doc.quantityIssued;
    if (Number(req.body.quantityIssued) > totalQuantityBeforeUpdate) {
      throw new Error(`You need ${Number(req.body.quantityIssued) - totalQuantityBeforeUpdate} ${item._doc.unitShortform} more to issue. Can not issue more than ${totalQuantityBeforeUpdate} ${item._doc.unitShortform}`);
    }
    await Item.findByIdAndUpdate(
      record._doc.item,
      {
        $set: {
          remainingQuantity: totalQuantityBeforeUpdate - Number(req.body.quantityIssued),
        },
      },
    );
    res.json({ record });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:_id', async (req, res) => {
  try {
    const record = await Record.findByIdAndRemove(req.params._id, { new: true });
    await Item.findByIdAndUpdate(
      record._doc.item,
      {
        $inc: {
          remainingQuantity: record._doc.quantityIssued,
        },
      },
    );
    res.json({ record });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
