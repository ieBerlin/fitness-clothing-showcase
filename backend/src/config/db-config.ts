import mongoose from "mongoose";
async function connectToDB() {
  const MONGO_URI = process.env.MONGODB_URI;
  try {
    await mongoose.connect(MONGO_URI!);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("MongoDB connection failed :");
    console.log(error);
    process.exit(1);
  }
}
export default connectToDB;
