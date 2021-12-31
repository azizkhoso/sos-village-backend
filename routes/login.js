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
  } catch (e) {
    return res.status(500).json({ error: e.errors[0] });
  }
  if (req.body.email !== process.env.ADMIN_EMAIL) {
    return res.status(401).json({ error: 'Admin email is incorrect' });
  }
  if (req.body.password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Admin password is incorrect' });
  }
  const token = jwt.sign({ admin: 'admin' }, process.env.JWT_SECRET);
  return res.json({ admin: 'admin', token });
});

module.exports = router;
