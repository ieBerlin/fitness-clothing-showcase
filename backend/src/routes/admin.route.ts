import { Router } from "express";
import createAdmin from "../controllers/auth/createAdmin";
import loginAdmin from "../controllers/auth/loginAdmin";
import adminAuth from "../middlewares/adminAuth";
import deserializeAdmin from "../middlewares/deserializeAdmin";
import updateAdminPassword from "../controllers/auth/updateAdminPassword";
import allowAccess from "../controllers/auth/allowAccess";

const router = Router();

router.post("/signup", deserializeAdmin, adminAuth, createAdmin);
router.post("/login", loginAdmin);
router.post("/check-token",deserializeAdmin, adminAuth, allowAccess);
router.put(
  "/update-password",
  deserializeAdmin,
  adminAuth,
  updateAdminPassword
);
export default router;
