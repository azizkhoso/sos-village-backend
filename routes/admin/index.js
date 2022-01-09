/* eslint-disable no-underscore-dangle */
/* eslint-disable no-await-in-loop */
const express = require('express');
const multer = require('multer');
const imageToUri = require('image-to-uri');
const date = require('date-and-time');
const fs = require('fs');
const yup = require('yup');

const Test = require('../../models/test');

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const testSchema = yup.object({
  title: yup.string().required('Title is required').min(4, 'Enter at least 4 characters'),
  subject: yup.string().required('Subject is required'),
  startsAt: yup.date().min(new Date(), 'Test cannot be hold in past time'),
  submittableBefore: yup.date().min(new Date(), 'Test cannot be uploaded after end time').required('End time is required'),
  isDemo: yup.bool(),
  qualification: yup.string().required('Qualification is required').oneOf(['XI', 'XII', 'Bachelor', 'Masters'], 'Not a valid qualification'),
  questions: yup.array().min(3, 'The test should have at least 3 questions'),
});
const mcqsSchema = yup.object({
  statement: yup.string().required('Question Statement is required').min(3, 'Enter at least 3 characters'),
  A: yup.string().required('Option A is required'),
  B: yup.string().required('Option B is required'),
  C: yup.string().required('Option C is required'),
  D: yup.string().required('Option D is required'),
  answer: yup.string().required('Correct Option is required'),
  duration: yup.number().required('Duration is required').min(5, 'At least 5 seconds should be given').max(180, 'At most 3 minutes (180s) should be given'),
});
const blankSchema = yup.object({
  statement: yup.string().required('Question Statement is required').min(3, 'Enter at least 3 characters'),
  answer: yup.string().required('Answer is required'),
  duration: yup.number().required('Duration is required').min(5, 'At least 5 seconds should be given').max(180, 'At most 3 minutes (180s) should be given'),
});
const trueFalseSchema = yup.object({
  statement: yup.string().required('Question Statement is required').min(3, 'Enter at least 3 characters'),
  answer: yup.string().required('Answer is required'),
  duration: yup.number().required('Duration is required').min(5, 'At least 5 seconds should be given').max(180, 'At most 3 minutes (180s) should be given'),
});

const router = express.Router();

router.get('/dashboard', async (req, res) => {
  res.end('Admin dashboard');
});

router.get('/announcements', async (req, res) => {
  res.end('Admin dashboard');
});

router.get('/tests', async (req, res) => {
  const tests = await Test.find({}, { questions: 0 });
  res.json({ tests });
});

const upload = multer({ storage, limits: { fileSize: 30000 } });
router.post('/tests', upload.array('images'), async (req, res) => {
  const test = req.body;
  test.questions = JSON.parse(test.questions);
  // Converting images to data uri
  test.questions = test.questions.map((q) => {
    if (q.image) {
      return {
        ...q,
        image: imageToUri(req.files.shift().path),
      };
    }
    return q;
  });
  // Deleting images from local storage
  fs.readdir('uploads', (err, files) => {
    files.forEach((file) => fs.unlink(`uploads/${file}`, (e) => {
      if (e) console.error(e);
      console.log(`uploads/${file} deleted successfully...`);
    }));
  });
  try {
    await testSchema.validate(test);
    for (let i = 0; i < test.questions.length; i += 1) {
      const q = test.questions[i];
      if (q.type === 'MCQS') {
        await mcqsSchema.validate(q);
      } else if (q.type === 'Blank') {
        await blankSchema.validate(q);
      } else if (q.type === 'TrueFalse') {
        await trueFalseSchema.validate(q);
      }
    }
    const startsAt = (new Date(test.startsAt)).getTime(); // returns milli seconds
    const submittableBefore = (new Date(test.submittableBefore)).getTime();
    if (submittableBefore <= startsAt) throw new Error('Test can not start and end at same time');
    let duration = 0;
    test.questions.forEach((q) => { duration += q.duration * 1000; });
    const endsAt = startsAt + duration;
    if (submittableBefore < endsAt) throw new Error(`Test should end at least ${Math.ceil(Number(duration / (1000 * 60)))} minutes after starting`);
    const newTest = await Test.create(test);
    res.json({ _id: newTest._id, title: newTest.title });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.delete('/tests/:_id', async (req, res) => {
  try {
    const { _id } = req.params;
    let test = await Test.findOne({ _id }, { questions: 0 });
    const now = new Date();
    const startsAt = new Date(test.startsAt);
    const submittableBefore = new Date(test.submittableBefore);
    if (
      date.subtract(submittableBefore, now).toSeconds() > 0
      && date.subtract(now, startsAt).toSeconds() > 0
    ) {
      throw new Error('Can not delete test while it is active');
    } else {
      test = await Test.findOneAndDelete({ _id }, { new: true, projection: { questions: 0 } });
    }
    res.json({ test });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
