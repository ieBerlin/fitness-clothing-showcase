import express from "express";
import dotenv from "dotenv";
import Routes from "./routes";
import connectToDB from "./config/db-config";

dotenv.config();
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5431;
Routes(app);
app.listen(PORT, async () => {
  console.log(`Server is listening on port: ${PORT}`);
  await connectToDB();
});
