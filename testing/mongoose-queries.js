const { ObjectId } = require('mongodb');

const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');
const { log } = require('./lib')

/* mongoose does not require to pass in an ObjectId */
let _id = '5d55d466cffc6217288682f9';

if (!ObjectId.isValid(_id)) {
  log('ID not valid');
}

/* fake id for testing */
// _id = '7775d466cffc6217288682f9';

/* find all todos with that id */
Todo.find({ _id })
.then(todos => log('Todos', todos))
.catch(log);

/* get the first match for the query */
Todo.findOne({ _id })
.then(todo => log('Todo', todo))
.catch(log);

/* find using id */
Todo.findById(_id)
.then(todo => {
  if (!todo) return log('Id not found');
  log('Todo by Id', todo)
})
.catch(log);

/* Find User by Id */

let userId = '5d54655ba10fb53448ec029e';

User.findById(userId)
.then(user => {
  if (!user) return log('Unable to find user');
  log('Found user:');
  console.log(JSON.stringify(user, undefined, 2));
})
.catch(log);