import { Router } from "express";
import getAllSections from "../controllers/section/getAllSections";
import getSection from "../controllers/section/getSection";
import updateSection from "../controllers/section/updateSection";
import deserializeUser from "../middlewares/deserializeUser";
import adminAuth from "../middlewares/adminAuth";

const router = Router();

// Client and admin routes
router.get("/", getAllSections);
router.get("/:sectionId", getSection);

// Admin routes
router.put("/:sectionId", deserializeUser, adminAuth, updateSection);

export default router;
