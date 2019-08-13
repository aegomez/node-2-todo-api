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

    // /* Delete all Todos with text = 'Eat lunch' */
    db.collection('Todos')
    .deleteMany({
      text: 'Eat lunch'
    })
    .then(log)
    .catch(log);

    // /* Delete the first document that fits the criteria */
    db.collection('Todos')
    .deleteOne({
      text: 'Walk the dog'
    })
    .then(log)
    .catch(log);
    
    /* Delete one document and return it */
    db.collection('Todos')
    .findOneAndDelete({
      completed: false
    })
    .then(log)

    /* Users collection */

    /* Delete all users named Adrian */
    db.collection('Users')
    .deleteMany({
      name: 'Adrian'
    })
    .then(result => {
      log('Users deleted successfully');
    })
    .catch(log);

    /* Delete a single user by ID */
    db.collection('Users')
    .findOneAndDelete(
      {
        _id: new ObjectID("5d52eedfd942a13ef447f5de")
      }
    )
    .then(result => {
      log('User deleted successfully');
      console.log(JSON.stringify(result, undefined, 2));
    })
    .catch(log);


    client.close();
  }
);