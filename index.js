require('dotenv').config();
const https = require('https');
const fs = require('fs');
const express = require('express');
const cors = require('cors');

const signupRouter = require('./routes/signup');
const loginRouter = require('./routes/login');
const adminRouter = require('./routes/admin');
const studentRouter = require('./routes/student');

const verifyToken = require('./middlewares');

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
};

const app = express();
const server = https.createServer(options, app);
const db = require('./config/db');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/admin', adminRouter);
app.use('/student', verifyToken, studentRouter);

db.once('open', () => console.log('Connected to database successfully...'));
server.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));
