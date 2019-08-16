// library imports
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb').ObjectId;

// local imports
const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

// helper functions
const log = (...args) => console.log('**', ...args);

const app = express();
const PORT = 3000;

// middleware
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  let todo = new Todo({
    text: req.body.text
  });

  todo.save()
  .then(doc => {
    res.send(doc);
  })
  .catch(err => {
    res.status(400).send(err);
  });
});

app.get('/todos', (req, res) => {
  Todo.find()
  .then(todos => res.send({ todos }))
  .catch(err => res.status(400).send(err));
});

app.get('/todos/:id', (req, res) => {
  let id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(404).send('F');
  }

  Todo.findById(id)
  .then(todo => todo ?
    res.send({ todo }) :
    res.status(404).send('F'))
  .catch(err => res.status(400).send());

});

app.listen(PORT, () => {
  log('Started on port', PORT);
});

module.exports = { app };
