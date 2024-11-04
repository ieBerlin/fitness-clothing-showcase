import { Router } from "express";
import getNotifications from "../controllers/notification/getNotifications";
import markAsRead from "../controllers/notification/markAsRead";
import adminAuth from "../middlewares/adminAuth";
import deserializeAdmin from "../middlewares/deserializeAdmin";

const router = Router();

router.get("/", deserializeAdmin, adminAuth, getNotifications);

router.put("/mark-as-read", deserializeAdmin, adminAuth, markAsRead);

export default router;
