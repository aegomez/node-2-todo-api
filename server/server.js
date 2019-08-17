// library imports
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb').ObjectId;

const pick = require('lodash/pick');
const isBoolean = require('lodash/isBoolean');

// local imports
const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

// helper functions
const log = (...args) => console.log('**', ...args);

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  let todo = new Todo({
    text: req.body.text
  });

  todo.save()
  .then(doc => res.send(doc))
  .catch(err => res.status(400).send(err));
});

app.get('/todos', (req, res) => {
  Todo.find()
  .then(todos => res.send({ todos }))
  .catch(err => res.status(400).send(err));
});

app.get('/todos/:id', (req, res) => {
  let id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(404).send('Not valid');
  }

  Todo.findById(id)
  .then(todo => todo ?
    res.send({ todo }) :
    res.status(404).send('Not found'))
  .catch(err => res.status(400).send('DB error'));
});

app.delete('/todos/:id', (req, res) => {
  let id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(404).send('Not valid');
  }

  Todo.findByIdAndRemove(id)
  .then(todo => todo ?
    res.send({ todo }) :
    res.status(404).send('Not found'))
  .catch(err => res.status(400).send('DB error'));
});

app.patch('/todos/:id', (req, res) => {
  let id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(404).send('Not valid');
  }

  let body = pick(req.body, [ 'text', 'completed' ]);

  if (isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  }
  else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate( id,
    { $set: body },
    { new: true }
  )
  .then(todo => todo ?
    res.send({ todo }) :
    res.status(404).send('Not found'))
  .catch(err => res.status(400).send('DB error'));
});

app.listen(PORT, () => {
  log('Started on port', PORT);
});

module.exports = { app };
