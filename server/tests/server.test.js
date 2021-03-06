const expect = require('expect');
const request = require('supertest');
const { ObjectId } = require('mongodb').ObjectId;

const { app } = require('../server');
const { Todo } = require('../models/todo');

const todos = [
  {
    _id: new ObjectId(),
    text: 'First test todo'
  },
  {
    _id: new ObjectId(),
    text: 'Second test todo',
    completed: true,
    completedAt: 9999
  }
];

// empty, then prefill the database before each test
beforeEach(done => {
  Todo.deleteMany({})
  .then(() => Todo.insertMany(todos))
  .then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', done => {
    let text = 'A certain todo text';

    request(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find({ text })
        .then(todos => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        })
        .catch(done);
      });
  });

  it('should not create todo with invalid body data', done => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find()
        .then(todos => {
          expect(todos.length).toBe(2);
          done();
        })
        .catch(done);
      });
  });
});


describe('GET /todos', () => {
  it('should get all todos', done => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});


describe('GET /todos/:id', () => {
  it('should return todo doc', done => {
    request(app)
      .get('/todos/' + todos[0]._id.toHexString())
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo not found', done => {
    request(app)
      .get('/todos/' + new ObjectId().toHexString())
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', done => {
    request(app)
      .get('/todos/fakeid')
      .expect(404)
      .end(done);
  });
});


describe('DELETE /todos/:id', () => {
  it('should remove a todo', done => {
    let hexId = todos[1]._id.toHexString();

    request(app)
      .delete('/todos/' + hexId)
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.findById(hexId)
        .then(todo => {
          expect(todo).toBeFalsy();
          done();
        })
        .catch(done);
      });
  });

  it('should return 404 if todo not found', done => {
    request(app)
      .delete('/todos/' + new ObjectId().toHexString())
      .expect(404)
      .end(done);
  });

  it('should return 404 if object id is invalid', done => {
    request(app)
      .delete('/todos/fakeid123')
      .expect(404)
      .end(done);
  });
});


describe('PATCH /todos/:id', () => {
  it('should update a todo', done => {
    let hexId = todos[0]._id.toHexString();
    let str = 'Updated Text 1';

    request(app)
      .patch('/todos/' + hexId)
      .send({
        text: str,
        completed: true
      })
      .expect(200)
      .expect(res => {
        let todo = res.body.todo;
        expect(todo.text).toBe(str);
        expect(todo.completed).toBe(true);
        expect(typeof todo.completedAt).toBe('number');
      })
      .end(done);
  });

  it('should clear completedAt when todo is not completed', done => {
    let hexId = todos[1]._id.toHexString();
    let str = 'Updated Text 2';

    request(app)
      .patch('/todos/' + hexId)
      .send({
        text: str,
        completed: false
      })
      .expect(200)
      .expect(res => {
        let todo = res.body.todo;
        expect(todo.text).toBe(str);
        expect(todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeNull();
      })
      .end(done);
  });

  it('should return 404 if todo not found', done => {
    request(app)
      .patch('/todos/' + new ObjectId().toHexString())
      .expect(404)
      .end(done);
  });

  it('should return 404 if object id is invalid', done => {
    request(app)
      .patch('/todos/fakeid123')
      .expect(404)
      .end(done);
  });
});
