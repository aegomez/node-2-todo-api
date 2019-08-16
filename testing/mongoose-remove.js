const { ObjectId } = require('mongodb');

const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');
const { log } = require('./lib')

/* remove() - deprecated, try deleteOne(), deleteMany(), etc.*/

// Todo.deleteMany({})
// .then(result => log('Deleted all Todos\n', result))
// .catch(err => log('ERROR\n', err));

/* findOneAndRemove() */

// Todo.findOneAndRemove({ text: 'delet this' })
// .then(result => log('Results of remove one:\n', result))
// .catch(err => log('ERROR\n', err));

/* findByIdAndRemove() */

Todo.findByIdAndRemove("5d5731ead3a00346b97afde1")
.then(result => log('Find by Id and remove:\n', result))
.catch(err => log('ERROR\n', err));
