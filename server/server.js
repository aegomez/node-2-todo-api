// library imports
const express = require('express');
const bodyParser = require('body-parser');

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
  // log(req.body);
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

app.listen(PORT, () => {
  log('Started on port', PORT);
});

module.exports = { app };
