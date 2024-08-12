import { Express } from "express";
import adminRoute from "./routes/admin.route";
function Routes(app: Express) {
  app.use("/api/auth", adminRoute);
}
export default Routes;
