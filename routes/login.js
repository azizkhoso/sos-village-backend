/* eslint-disable no-underscore-dangle */
const express = require('express');
const jwt = require('jsonwebtoken');
const yup = require('yup');

const router = express.Router();

const schema = yup.object({
  user: yup.string().required('User is required').min(3, 'User name should be at least 3 characters long'),
  password: yup.string().required('Password is required').min(8, 'Password should be at least 8 characters long'),
});

router.post('/', async (req, res) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
  } catch (e) {
    return res.status(400).json({ error: e.errors[0] });
  }
  if (req.body.user !== process.env.ADMIN_NAME) {
    return res.status(401).json({ error: 'Admin name is incorrect' });
  }
  if (req.body.password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Admin password is incorrect' });
  }
  const token = jwt.sign({ admin: 'admin' }, process.env.JWT_SECRET);
  return res.json({ admin: 'admin', token });
});

module.exports = router;
