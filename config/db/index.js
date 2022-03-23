const mongoose = require('mongoose');

const {
  DB_URL,
} = process.env;

const uri = `${DB_URL}`;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db;
