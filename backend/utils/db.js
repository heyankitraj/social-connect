import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database connected successfully...");
  } catch (error) {
    console.error("Database connection error: ", error.message || error);
  }
};

export default connectDB;