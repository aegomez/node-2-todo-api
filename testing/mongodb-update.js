const { MongoClient, ObjectID } = require('mongodb');

const { log } = require('./lib');
const { URL } = require('../mongo-url');

MongoClient.connect(
  URL,
  { useNewUrlParser: true },
  (err, client) => {
    if (err) {
      return log('Unable to connect to MongoDB server', err);
    }
    log('Connected to MongoDB server');

    const db = client.db('TodoApp');

    /* Todos */
    db.collection('Todos').findOneAndUpdate(
      { _id: new ObjectID("5d533c666e3275932ade0def") },
      {
        $set: {
          completed: true
        }
      },
      { returnOriginal: false }
    )
    .then(result => {
      log('Document successfully updated', result);
    })
    .catch(err => {
      log('Unable to update document', err);
    });
    
    client.close();

    /* Users */
    db.collection('Users').findOneAndUpdate(
      { _id: 1 },
      {
        $set: {
          name: 'Ed'
        },
        $inc: {
          age: -2
        }
      },
      { returnOriginal: false }
    )
    .then(result => {
      log('Document successfully updated', result);
    })
    .catch(err => {
      log('Unable to update document', err);
    });
    
    client.close();
  }
);