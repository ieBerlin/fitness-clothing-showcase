import { Router } from "express";
import getTrafficData from "../controllers/traffic/getTrafficData";
import trackPageView from "../controllers/traffic/trackPageView ";

const router = Router();
router.get("/", getTrafficData);
router.post("/track-page-view", trackPageView);

export default router;
