const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const Todos = require("./models/TodoModel");
const cors = require("cors");
const path = require("path");

app.use(express.static(path.join(__dirname, "dist")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

app.use(express.json());
app.use(cors());
const port = 3001;

app.get("/api/todos/", async (req, res) => {
  const getTodos = await Todos.find({}).sort({ createdAt: -1 });
  // If find({}) is empty, gets all without filtering. If find({completed: true}) - Filters for completed:true tasks
  res.status(200).json(getTodos);
});

app.post("/api/todos/", async (req, res) => {
  const { title, completed } = req.body;
  try {
    const todo = await Todos.create({
      title,
      completed,
    });
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
  const updateTodo = await Todos.findOneAndUpdate(
    { _id: id },
    { completed }, // Only update the 'completed' field
    { new: true } // Return the updated task
  );
  if (!updateTodo) {
    return res.status(400).json({ error: "No such Task" });
  }
  res.status(200).json({ message: "Task updated" });
});
app.delete("/api/todos/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such Task" });
  }
  const deleteTodo = await Todos.findOneAndDelete({ _id: id });
  if (!deleteTodo) {
    return res.status(400).json({ error: "No such Task" });
  }
  res.status(200).json({ message: "Task deleted" });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`DB is connected successfully`);
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
