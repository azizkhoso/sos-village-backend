const express = require('express');
const jwt = require('jsonwebtoken');
const yup = require('yup');

const router = express.Router();

const schema = yup.object({
  email: yup.string().required('Email is required').email('Enter a valid email'),
  password: yup.string().required('Password is required').min(8, 'Password should be at least 8 characters long'),
});

router.post('/student', async (req, res) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
    res.json({ student: 's1', token: 't1' });
  } catch (e) {
    res.status(400);
    res.json({ errors: e.errors });
  }
});

router.post('/teacher', (req, res) => {
  res.json({ teacher: 't1', token: 't1' });
});

router.post('/admin', async (req, res) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
    if (req.body.email !== process.env.ADMIN_EMAIL) {
      res.status(401);
      res.json({ errors: ['Admin email is incorrect'] });
      return;
    }
    if (req.body.password !== process.env.ADMIN_PASSWORD) {
      res.status(401);
      res.json({ errors: ['Admin password is incorrect'] });
      return;
    }
    const token = jwt.sign({ admin: 'admin' }, process.env.JWT_SECRET);
    res.json({ admin: 'admin', token });
  } catch (e) {
    res.status(400);
    res.json({ errors: e.errors });
  }
});

module.exports = router;
