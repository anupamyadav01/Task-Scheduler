import cron from "node-cron";
import { Task, TaskLog } from "../Models/taskModel.js";
import { sendEmail } from "./SendMail.js";
import logger from "../Config/logger.js";

// Schedule a task
export const scheduleTask = async (task) => {
  const job = cron.schedule(task.schedule, async () => {
    try {
      // Send email when the task is executed
      await sendEmail(task.email, "Scheduled Task", task.message);

      // Create and save task log with 'success' status
      const tasklog = new TaskLog({
        taskId: task.taskId,
        executedAt: new Date(),
        status: "success",
      });
      await tasklog.save();

      // Log task execution success
      logger.info(
        `Task ${
          task.name
        } executed successfully at ${new Date().toLocaleString()}`,
        {
          taskId: task.taskId,
          status: "success",
        }
      );
    } catch (error) {
      // Create and save task log with 'failure' status
      const tasklog = new TaskLog({
        taskId: task.taskId,
        executedAt: new Date(),
        status: "failure",
      });
      await tasklog.save();

      // Log task execution failure
      logger.error(
        `Task ${task.name} failed at ${new Date().toLocaleString()}: ${
          error.message
        }`,
        {
          taskId: task.taskId,
          error: error.message,
          status: "failure",
        }
      );
    }
  });

  // Start the cron job immediately
  job.start();
};

// Initialize all active tasks
export const initializeTasks = async () => {
  try {
    // Find all active tasks in the database
    const tasks = await Task.find({ status: "active" });
    if (tasks.length === 0) {
      logger.info("No active tasks found to initialize.");
    }

    // Schedule each active task
    tasks.forEach((task) => scheduleTask(task));
    logger.info("All active tasks initialized successfully.");
  } catch (error) {
    // Log any errors during initialization
    logger.error("Error initializing tasks:", {
      error: error.message,
    });
  }
};
