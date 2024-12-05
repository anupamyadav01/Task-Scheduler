import cron from "node-cron";
import { Task, TaskLog } from "../Models/taskModel.js";
import { scheduleTask } from "../Config/cronConfig.js";
import { v4 as uuidv4 } from "uuid";

// In-memory tasks array for optional usage
let tasks = [];

// Create Task
export const CreateTask = async (req, res) => {
  try {
    const { name, schedule, email, message, expiration } = req.body;

    console.log("Request body is:", req.body);

    // Validate input
    if (!name || !schedule || !email || !message) {
      return res
        .status(400)
        .json({ message: "All mandatory fields are required." });
    }

    // Validate schedule format
    if (!cron.validate(schedule)) {
      return res.status(400).json({ message: "Invalid schedule format." });
    }

    // Validate email format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    // Generate unique taskId
    const taskId = uuidv4();
    console.log("Generated taskId:", taskId);

    // Push task to in-memory tasks array (optional, for reference)
    tasks.push({ name, schedule, email, message });

    // Create and save the task in the database
    const task = new Task({
      taskId,
      name,
      schedule,
      email,
      message,
      expiration: expiration || null, // Optional expiration
    });
    await task.save();

    // Schedule the task
    scheduleTask(task);

    console.log("Task created successfully.");
    res
      .status(201)
      .json({ message: "Task created and scheduled successfully." });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Edit Task
export const editTask = async (req, res) => {
  try {
    const { uuid, name, schedule, email, message } = req.body;

    // Find the task by UUID
    const task = await Task.findOne({ uuid });
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    // Validate and update task details
    if (schedule && !cron.validate(schedule)) {
      return res.status(400).json({ message: "Invalid schedule format." });
    }
    task.name = name || task.name;
    task.schedule = schedule || task.schedule;
    task.email = email || task.email;
    task.message = message || task.message;

    await task.save(); // Save updated task

    res.status(200).json({ message: "Task updated successfully." });
  } catch (error) {
    console.error("Error editing task:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Delete Task
export const deleteTask = async (req, res) => {
  try {
    const { uuid } = req.body;

    const task = await Task.findOneAndDelete({ uuid });
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    // Optionally delete associated logs (if required)
    await TaskLog.deleteMany({ taskId: task.taskId });

    res.status(200).json({ message: "Task deleted successfully." });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Get All Tasks
export const getAllTask = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Get Task By ID (Stub Implementation)
export const getTaskById = async (req, res) => {
  console.log("Cron job executed at:", new Date().toLocaleString());
};

// Stop Task
export const stopTask = async (req, res) => {
  try {
    const { uuid } = req.body;

    // Find the task by UUID
    const task = await Task.findOne({ uuid });
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    // Update task status to "stopped"
    task.status = "stopped";
    await task.save();

    res.status(200).json({ message: "Task stopped successfully." });
  } catch (error) {
    console.error("Error stopping task:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Start Task
export const startTask = async (req, res) => {
  try {
    const { uuid } = req.body;

    // Find the task by UUID
    const task = await Task.findOne({ uuid });
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    // Update task status to "active"
    task.status = "active";
    await task.save();

    res.status(200).json({ message: "Task activated successfully." });
  } catch (error) {
    console.error("Error activating task:", error);
    res.status(500).json({ message: "Server error." });
  }
};
