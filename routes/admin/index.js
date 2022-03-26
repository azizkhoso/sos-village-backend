/* eslint-disable no-underscore-dangle */
/* eslint-disable no-await-in-loop */
const express = require('express');

const housesRouter = require('./houses');
const itemsRouter = require('./items');

const router = express.Router();

router.get('/dashboard', async (req, res) => {
  res.end('Admin dashboard');
});

router.get('/announcements', async (req, res) => {
  res.end('Admin announcements');
});

router.use('/houses', housesRouter);

router.use('/items', itemsRouter);

module.exports = router;
