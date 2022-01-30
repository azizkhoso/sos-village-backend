require('dotenv').config();
const express = require('express');
const cors = require('cors');

const signupRouter = require('./routes/signup');
const loginRouter = require('./routes/login');
const othersRouter = require('./routes/others');
const adminRouter = require('./routes/admin');
const studentRouter = require('./routes/student');

const verifyToken = require('./middlewares/verifyToken');

const app = express();
const db = require('./config/db');

app.use(cors()); // For accessing from any where
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', othersRouter);
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/admin', verifyToken, adminRouter);
app.use('/student', verifyToken, studentRouter);

db.once('open', () => console.log('Connected to database successfully...'));
app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));
