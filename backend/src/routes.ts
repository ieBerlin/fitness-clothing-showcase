import { Express } from "express";
import adminRouter from "./routes/admin.route";
import productRouter from "./routes/product.route";
import notificationRouter from "./routes/notification.route";
import sectionRouter from "./routes/section.route";
import imageRouter from "./routes/image.route";
import activityRouter from "./routes/activity.route";
import trafficRouter from "./routes/traffic.route";
import statisticsRouter from "./routes/statistics.route";
function Routes(app: Express) {
  app.use("/api/auth", adminRouter);
  app.use("/api/product", productRouter);
  app.use("/api/notification", notificationRouter);
  app.use("/api/section", sectionRouter);
  app.use("/api/image", imageRouter);
  app.use("/api/activity", activityRouter);
  app.use("/api/traffic", trafficRouter);
  app.use("/api/statistics", statisticsRouter);
}
export default Routes;
