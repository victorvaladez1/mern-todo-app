// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Import the Todo model
const Todo = require('./models/Todo');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define routes
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();  // Check if Todo is properly imported and is a Mongoose model
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Additional routes (POST, DELETE, etc.) here...

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

app.post('/todos', async (req, res) => {
    try {
      const todo = new Todo({
        title: req.body.title,
        completed: req.body.completed || false, // Default to false if not provided
      });
      await todo.save();
      res.status(201).json(todo); // Send back the created to-do item
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.delete('/todos/:id', async (req, res) => {
    try {
      const todo = await Todo.findByIdAndDelete(req.params.id);
      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }
      res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  