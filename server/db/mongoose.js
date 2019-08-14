const mongoose = require('mongoose');

// replace URL as needed
const {URL} = require('../../mongo-url');

mongoose.Promise = global.Promise;
mongoose.connect(URL, { useNewUrlParser: true });

module.exports = { mongoose };