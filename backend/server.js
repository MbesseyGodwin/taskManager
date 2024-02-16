// Import required modules
const express = require("express");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const authenticateUser = require("./authMiddleware");
const errorHandler = require("./errorHandler");
const cors = require("cors");
// Import dotenv and configure
require('dotenv').config();

// Accessing environment variables
const connectionString = process.env.DB_CONNECTION_STRING;
const jwtSecret = process.env.JWT_SECRET;


// Create an Express application
const app = express();

// Set up a PostgreSQL connection pool
const pool = new Pool({
  connectionString: connectionString,
  ssl: true, // enabled
  rejectUnauthorized: false,
});

// Middleware to parse JSON request bodies
app.use(express.json());

// CORS middleware
app.use(cors());

// Route for user registration
app.post("/register",
  [
    // Validate username and password
    body("username").notEmpty().isLength({ min: 3 }),
    body("password").notEmpty().isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      // Hash the password before storing it in the database
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user into the database
      const newUser = await pool.query(
        "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
        [username, hashedPassword]
      );

      // Return the newly created user
      res.status(201).json(newUser.rows[0]);
    } catch (err) {
      // Handle database errors
      console.error(err);
      res.status(500).json({ message: "Error registering user" });
    }
  }
);

// Route for user login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    // Check if user exists and password is correct
    if (
      user.rows.length === 0 ||
      !(await bcrypt.compare(password, user.rows[0].password))
    ) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.rows[0].id }, jwtSecret, {
      expiresIn: "2h",
    });

    // Return token
    res.json({ token });
  } catch (err) {
    // Handle database errors
    console.error(err);
    res.status(500).json({ message: "Error logging in" });
  }
});

// Route to create a new task
app.post("/tasks", authenticateUser, async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id;

  try {
    // Insert new task into the database
    const newTask = await pool.query(
      "INSERT INTO tasks (user_id, title, description) VALUES ($1, $2, $3) RETURNING *",
      [userId, title, description]
    );

    // Return the newly created task
    res.status(201).json(newTask.rows[0]);
  } catch (err) {
    // Handle database errors
    console.error(err);
    res.status(500).json({ message: "Error creating task" });
  }
});

// Route to fetch tasks for a specific user
app.get("/tasks", authenticateUser, async (req, res) => {
  const userId = req.user.id;

  try {
    // Fetch tasks from the database for the authenticated user
    const tasks = await pool.query("SELECT * FROM tasks WHERE user_id = $1", [
      userId,
    ]);

    // Return tasks
    res.json(tasks.rows);
  } catch (err) {
    // Handle database errors
    console.error(err);
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

// Route to update a task
app.put("/tasks/:taskId", async (req, res) => {
  const taskId = req.params.taskId;
  const { title, description, status } = req.body;

  try {
    // Update task in the database
    const updatedTask = await pool.query(
      "UPDATE tasks SET title = $1, description = $2, status = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *",
      [title, description, status, taskId]
    );
    

    // Check if task exists
    if (updatedTask.rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Return the updated task
    res.json(updatedTask.rows[0]);
  } catch (err) {
    // Handle database errors
    console.error(err);
    res.status(500).json({ message: "Error updating task" });
  }
});

// Route to delete a task
app.delete("/tasks/:taskId", async (req, res) => {
  const taskId = req.params.taskId;

  try {
    // Delete task from the database
    const deletedTask = await pool.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING *",
      [taskId]
    );

    // Check if task exists
    if (deletedTask.rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Return the deleted task
    res.json({ message: "Task deleted successfully" });
    console.log("task deleted successfully");
  } catch (err) {
    // Handle database errors
    console.error(err);
    res.status(500).json({ message: "Error deleting task" });
  }
});

// Error handling middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
