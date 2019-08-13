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

    /* print find results */
    db.collection('Todos')
    .find({
      // completed: false
      _id: new ObjectID('5d51ff13d9d4c82a78dff5d9')
    })
    .toArray()
    .then(docs => {
      log('Todos:');
      console.log(JSON.stringify(docs, undefined, 2));
    })
    .catch(err => log('Unable to fetch todos', err));

    /* count up all of the Todos in the collection */
    db.collection('Todos')
    .find()
    .count()
    .then(count => {
      log('Todos count:', count);
    })
    .catch(err => log('Unable to fetch todos', err));

    /* find all users named Adrian */
    db.collection('Users')
    .find({
      name: 'Adrian'
    })
    .toArray()
    .then(docs => {
      console.log(JSON.stringify(docs, undefined, 2));
    })
    .catch(err => log('Unable to fetch users', err));

    client.close();
  }
);