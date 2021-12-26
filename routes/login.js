const express = require('express');

const router = express.Router();

router.post('/student', (req, res) => {
  res.json({ student: 's1', token: 't1' });
});

router.post('/teacher', (req, res) => {
  res.json({ teacher: 't1', token: 't1' });
});

router.post('/admin', (req, res) => {
  res.json({ admin: 'a1', token: 't1' });
});

module.exports = router;
