import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectToDatabase from "./Config/connectToDatabase.js";
import routes from "./Routers/TaskRoutes.js";
import { initializeTasks } from "./Config/cronConfig.js";

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Database Connection
connectToDatabase();

// Routes
app.use("/api", routes);

// Initialize scheduled tasks
initializeTasks();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
