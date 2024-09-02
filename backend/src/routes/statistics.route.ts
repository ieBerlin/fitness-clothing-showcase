import { Router } from "express";
import getStatistics from "../controllers/statistics/getStatistics";

const router = Router();
router.get("/", getStatistics);
export default router;
