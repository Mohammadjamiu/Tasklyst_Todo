const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const Todos = require("./models/TodoModel");
const path = require("path");

app.use(express.static(path.join(__dirname, "dist")));

// Serve React app for all non-API routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.use(express.json());

// API Endpoints
app.get("/api/todos/", async (req, res) => {
  try {
    const getTodos = await Todos.find({}).sort({ createdAt: -1 });
    res.status(200).json(getTodos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/todos/", async (req, res) => {
  const { title, completed } = req.body;
  try {
    const todo = await Todos.create({ title, completed });
    res.status(200).json(todo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such Task" });
  }

  try {
    const updateTodo = await Todos.findOneAndUpdate(
      { _id: id },
      { completed },
      { new: true }
    );
    if (!updateTodo) {
      return res.status(400).json({ error: "No such Task" });
    }
    res.status(200).json({ message: "Task updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/api/todos/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such Task" });
  }

  try {
    const deleteTodo = await Todos.findOneAndDelete({ _id: id });
    if (!deleteTodo) {
      return res.status(400).json({ error: "No such Task" });
    }
    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`DB is connected successfully`);
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(`DB connection error: ${err.message}`);
  });
