const express = require("express");
const JWT = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const salt = 11;
const secretekey = "sanjaybisht";
const app = express();
const port = 8625;
const cors = require("cors");

// Middleware for parsing JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/todoApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB", err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Task Schema
const taskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
  position: { type: Number },
});

const Task = mongoose.model("Task", taskSchema);

// Register new user API
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ error: "User already exists" });

    const securepass = bcrypt.hashSync(password, salt);
    const newUser = new User({ name, email, password: securepass });

    await newUser.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Database insert error" });
  }
});

// Login user API
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isSecurePass = bcrypt.compareSync(password, user.password);
    if (!isSecurePass)
      return res.status(400).json({ error: "Invalid credentials" });

    const token = JWT.sign({ id: user._id, email: user.email }, secretekey, {
      expiresIn: 300,
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Database query error" });
  }
});

// Profile route to verify token
app.post("/profile", verifybytoken, (req, res) => {
  JWT.verify(res.token, secretekey, (err, success) => {
    if (err) {
      return res.status(403).json({ error: "Token is not valid" });
    }
    res.json({ success, msg: "Token is valid" });
  });
});

// Middleware to verify token
function verifybytoken(req, res, next) {
  const header = req.headers["authorization"];
  if (typeof header !== "undefined") {
    res.token = header;
    next();
  } else {
    res.status(403).json({ error: "Token is required" });
  }
}

// Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ position: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Add a new task
app.post("/tasks", async (req, res) => {
  const { task } = req.body;

  try {
    const newTask = new Task({ task });
    await newTask.save();
    res.json({ message: "Task added successfully", taskId: newTask._id });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Delete a task
app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Task.findByIdAndDelete(id);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update a task
app.put("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { task } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { task },
      { new: true }
    );
    if (!updatedTask) return res.status(404).json({ error: "Task not found" });

    res.json({ message: "Task updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// Toggle task completion
app.put("/tasks/completed/:id", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { completed },
      { new: true }
    );
    res.json({ message: "Task completion status updated" });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Search task by name
app.get("/tasks/search/:task", async (req, res) => {
  const { task } = req.params;

  try {
    const tasks = await Task.find({ task: { $regex: task, $options: "i" } });
    res.json(tasks);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update task order
app.put("/tasks/reorder", async (req, res) => {
  const { tasks } = req.body; // Array of tasks with new positions

  try {
    const updatePromises = tasks.map((task, index) => {
      return Task.findByIdAndUpdate(task.id, { position: index });
    });

    await Promise.all(updatePromises);
    res.json({ message: "Task order updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error });
  }
});

// Start the server
app.listen(port, () => {
  console.log("Server running on port", port);
});
