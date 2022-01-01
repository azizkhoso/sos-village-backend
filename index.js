require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const loginRouter = require('./routes/login');
const adminRouter = require('./routes/admin');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/login', loginRouter);
app.use('/admin', adminRouter);

db.once('open', () => console.log('Connected to database successfully...'));
app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));
