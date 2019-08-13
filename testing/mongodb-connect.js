const MongoClient = require('mongodb').MongoClient;
// const ObjectID = require('mongodb').ObjectID;

const log = require('./lib').log;
// replace URL according to project configuration
const URL = require('../mongo-url').URL;

// // testing ObjectID
// let obj = new ObjectID();
// log(obj);

MongoClient.connect(
  URL,
  {
    useNewUrlParser: true,
    //authSource: 'admin'
  },
  (err, client) => {
    if (err) {
      return log('Unable to connect to MongoDB server', err);
    }
    log('Connected to MongoDB server');

    const db = client.db('TodoApp');

    // Getting started
    db.collection('Todos').insertOne(
      {
        text: 'Something else to DO',
        completed: false
      },
      (err, result) => {
        if (err) {
          return log('Unable to insert todo', err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
      }
    );

    // Insert new doc into Users
    db.collection('Users').insertOne(
      {
        name: 'Adrian',
        age: 99,
        location: 'Tijuana'
      },
      (err, result) => {
        if (err) {
          return log('Unable to insert user', err);
        }
        log(result.ops);
      }
    );
    
    db.collection('Users').insertOne(
      {
        // _id: 1,  // non-default value
        name: 'Joe',
        age: 27,
        location: 'Berlin'
      },
      (err, result) => {
        if (err) {
          return log('Unable to insert user', err);
        }

        log('id:', result.ops[0]._id);
        log('timestamp:', result.ops[0]._id.getTimestamp());
      }
    );

    client.close();
  }
);