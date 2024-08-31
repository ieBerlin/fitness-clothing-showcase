import { Router } from "express";
import getAllSections from "../controllers/section/getAllSections";
import getSection from "../controllers/section/getSection";
import updateSectionItems from "../controllers/section/updateSectionItems";
import removeProductFromSection from "../controllers/section/removeProductFromSection";
import adminAuth from "../middlewares/adminAuth";
import deserializeAdmin from "../middlewares/deserializeAdmin";

const router = Router();

// Client and admin routes
router.get("/", getAllSections);
router.get("/:sectionId", getSection);

// Admin routes
router.put("/:sectionId", deserializeAdmin, adminAuth, updateSectionItems);
router.delete(
  "/:sectionId/:productId",
  deserializeAdmin,
  adminAuth,
  removeProductFromSection
);

export default router;
