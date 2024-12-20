import { Router } from "express";
import adminAuth from "../middlewares/adminAuth";
import deserializeAdmin from "../middlewares/deserializeAdmin";
import getAllActivities from "../controllers/activity/getAllActivities";
import getAdminActivities from "../controllers/activity/getAdminActivities";
import getSingleActivity from "../controllers/activity/getSingleActivity";

const router = Router();

router.get("/", deserializeAdmin, adminAuth, getAllActivities);
router.get("/my-activities", deserializeAdmin, adminAuth, getAdminActivities);
router.get("/:activityId", deserializeAdmin, adminAuth, getSingleActivity);

export default router;
