/* eslint-disable no-underscore-dangle */
/* eslint-disable no-await-in-loop */
const express = require('express');

const housesRouter = require('./houses');
const itemsRouter = require('./items');
const recordsRouter = require('./records');
const receiptsRouter = require('./receipts');
const inkindsRouter = require('./inkinds');

const router = express.Router();

router.get('/dashboard', async (req, res) => {
  res.end('Admin dashboard');
});

router.use('/houses', housesRouter);

router.use('/items', itemsRouter);

router.use('/records', recordsRouter);

router.use('/receipts', receiptsRouter);

router.use('/inkinds', inkindsRouter);

module.exports = router;
