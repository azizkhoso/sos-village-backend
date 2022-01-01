const express = require('express');
const Test = require('../../models/test');

const router = express.Router();

router.get('/dashboard', async (req, res) => {
  res.end('Admin dashboard');
});

router.get('/announcements', async (req, res) => {
  res.end('Admin dashboard');
});

router.get('/tests', async (req, res) => {
  const tests = await Test.find();
  res.json({ tests });
});

router.post('/tests', async (req, res) => {
  const test = req.body;
  res.json({ test });
});

module.exports = router;
