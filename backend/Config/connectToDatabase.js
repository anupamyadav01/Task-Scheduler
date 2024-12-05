import { set, connect } from "mongoose";

const connectToDatabase = async () => {
  set("strictQuery", false);

  if (!process.env.MONGO_URI || !process.env.DB) {
    console.error("Database environment variables are missing.");
    process.exit(1);
  }

  try {
    const conn = await connect(process.env.MONGO_URI, {
      dbName: process.env.DB,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectToDatabase;
