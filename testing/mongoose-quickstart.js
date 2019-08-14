const mongoose = require('mongoose');

const {log} = require('./lib');
const {URL} = require('../mongo-url');

mongoose.connect(URL, { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  log('Connection OK');

  // define a Schema
  let kittySchema = new mongoose.Schema({
    name: String
  });

  // methods must be added to the schema before compiling it
  kittySchema.methods.speak = function() {
    let greeting = this.name ?
      'Meow name is ' + this.name :
      'I don\'t have a name';
    log(greeting);
  }
  
  // compile the schema into a Model
  let Kitten = mongoose.model('Kitten', kittySchema);

  // use the model/class to create documents
  let silence = new Kitten({ name: 'Silence' });
  log('name:', silence.name);

  // methods get compiled into the model prototype
  let fluffy = new Kitten({ name: 'Fluffy' });
  fluffy.speak();

  // Save document to MongoDB

  // callback
  fluffy.save(function callback(err, fluff) {
    if (err) return log(err);
    fluff.speak();
  });

  // promises
  silence.save()
  .then(result => result.speak())
  .catch(log);

  // access all documents through the model
  Kitten.find(handleSearch);

  function handleSearch(err, results) {
    if (err) return log(err);
    log('Found:');
    console.log(results);
  }

  // filter search results
  Kitten.find({ name: /^F/ }, handleSearch);

  
  // db.close();
});
