import { Express } from "express";
import adminRouter from "./routes/admin.route";
import productRouter from "./routes/product.route";
import sectionRouter from "./routes/section.route";
import imageRouter from "./routes/image.route";
function Routes(app: Express) {
  app.use("/api/auth", adminRouter);
  app.use("/api/product", productRouter);
  app.use("/api/section", sectionRouter);
  app.use("/api/image", imageRouter);
}
export default Routes;
