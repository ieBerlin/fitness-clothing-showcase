import mongoose from "mongoose";
import { initializeSections } from "../utils/initialize-sections";
async function connectToDB() {
  const MONGO_URI = process.env.MONGODB_URI;
  try {
    await mongoose.connect(MONGO_URI!);
    console.log("MongoDB connected successfully");
    await initializeSections();
    console.log("Sections are initialized");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
export default connectToDB;
