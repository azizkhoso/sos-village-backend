require('dotenv').config();
const express = require('express');
const cors = require('cors');

const loginRouter = require('./routes/login');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/login', loginRouter);

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));
