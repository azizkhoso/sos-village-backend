require('dotenv').config();
const express = require('express');
const cors = require('cors');

const loginRouter = require('./routes/login');
const adminRouter = require('./routes/admin');

const verifyToken = require('./middlewares/verifyToken');

const app = express();
const db = require('./config/db');

app.use(cors()); // For accessing from any where
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/login', loginRouter);
app.use('/admin', verifyToken, adminRouter);
app.post('/login/verify', verifyToken, (req, res) => {
  res.json({ verified: true });
});

db.once('open', () => console.log('Connected to database successfully...'));
app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));
