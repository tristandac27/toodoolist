const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors'); // Ajoutez cette ligne

const app = express();
app.use(bodyParser.json());
app.use(cors());

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'todolist'
};


const connection = mysql.createConnection(dbConfig);


connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the MySQL server.');
});


app.get('/tasks', (req, res) => {
  connection.query('SELECT * FROM tasks', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});


app.post('/tasks', (req, res) => {
  const task = req.body;
  const query = 'INSERT INTO tasks SET ?';
  connection.query(query, task, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});


app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const task = req.body;
  const query = 'UPDATE tasks SET ? WHERE id = ?';
  connection.query(query, [task, id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});


app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM tasks WHERE id = ?';
  connection.query(query, id, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
