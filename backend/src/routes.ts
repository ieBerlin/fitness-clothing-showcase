import { Express } from "express";
import adminRouter from "./routes/admin.route";
import productRouter from "./routes/product.route";
import sectionRouter from "./routes/section.route";
function Routes(app: Express) {
  app.use("/api/auth", adminRouter);
  app.use("/api/product", productRouter);
  app.use("/api/section", sectionRouter);
}
export default Routes;
