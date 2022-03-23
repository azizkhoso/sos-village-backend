/* eslint-disable no-underscore-dangle */
/* eslint-disable no-await-in-loop */
const express = require('express');
/* const date = require('date-and-time');
const fs = require('fs');
const yup = require('yup'); */
const House = require('../../models/House');

const router = express.Router();

router.get('/dashboard', async (req, res) => {
  res.end('Admin dashboard');
});

router.get('/announcements', async (req, res) => {
  res.end('Admin announcements');
});

router.get('/houses', async (req, res) => {
  const houses = await House.find({});
  res.json({ houses });
});

router.get('/house/:_id', async (req, res) => {
  const house = await House.findOne({ _id: req.params._id });
  res.json({ house });
});

module.exports = router;
