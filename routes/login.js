/* eslint-disable no-underscore-dangle */
const express = require('express');
const jwt = require('jsonwebtoken');
const yup = require('yup');
const Student = require('../models/student');

const router = express.Router();

const schema = yup.object({
  email: yup.string().required('Email is required').email('Enter a valid email'),
  password: yup.string().required('Password is required').min(8, 'Password should be at least 8 characters long'),
});

router.post('/student', async (req, res) => {
  try {
    await schema.validate(req.body);
    const student = (await Student.findOne({ email: req.body.email }).select('_id fullName email password qualification'))._doc;
    if (!student) throw new Error('Student not found');
    if (student.password !== req.body.password) throw new Error('Incorrect password, please try again');
    const token = jwt.sign(
      { student: { ...student, password: undefined } },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      },
    );
    return res.json(
      {
        student: {
          ...student,
          password: undefined,
        },
        token,
      },
    );
  } catch (e) {
    return res.status(400).json({ error: e.message });
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
