import { Router } from "express";
import adminAuth from "../middlewares/adminAuth";
import deserializeAdmin from "../middlewares/deserializeAdmin";
import getAllActivities from "../controllers/activity/getAllActivities";
import getSingleActivity from "../controllers/activity/getSingleActivity";
import createActivity from "../controllers/activity/createActivity";

const router = Router();

router.get("/", deserializeAdmin, adminAuth, getAllActivities);

router.get("/:activityId", deserializeAdmin, adminAuth, getSingleActivity);

router.post("/", deserializeAdmin, adminAuth, createActivity);

export default router;
