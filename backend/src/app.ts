import express from "express";
import dotenv from "dotenv";
import Routes from "./routes";
import connectToDB from "./config/db-config";
import corsMiddleware from "./middlewares/corsConfig";
import delayMiddleware from "./middlewares/delayMiddleware";
dotenv.config();
const app = express();
app.use(express.json());
app.use(corsMiddleware);
app.use('/public',express.static('public'))
// app.use(delayMiddleware);
app.set('trust proxy',true)
const PORT = process.env.PORT || 5431;
Routes(app);
app.listen(PORT, async () => {
  console.log(`Server is listening on port: ${PORT}`);
  await connectToDB();
});
