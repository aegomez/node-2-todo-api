const mongoose = require('mongoose');

// replace URL as needed
const URL = process.env.MONGODB_URI ||
  require('../../mongo-url').URL;

mongoose.Promise = global.Promise;
mongoose.connect(URL, {
  useNewUrlParser: true,
  useFindAndModify: false
});

module.exports = { mongoose };