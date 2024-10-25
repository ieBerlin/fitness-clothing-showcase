import { Router } from "express";
import createAdmin from "../controllers/auth/createAdmin";
import loginAdmin from "../controllers/auth/loginAdmin";
import updateProfile from "../controllers/auth/updateProfile";
import getAdmins from "../controllers/auth/getAdmins";
import getSingleAdmin from "../controllers/auth/getSingleAdmin";
import getAdminProfile from "../controllers/auth/getAdminProfile";
import adminAuth from "../middlewares/adminAuth";
import deserializeAdmin from "../middlewares/deserializeAdmin";
import updateAdminPassword from "../controllers/auth/updateAdminPassword";
import allowAccess from "../controllers/auth/allowAccess";

const router = Router();
router.get("/", deserializeAdmin, adminAuth, getAdmins);
router.get("/my-profile", deserializeAdmin, adminAuth, getAdminProfile);
router.get("/:adminId", deserializeAdmin, adminAuth, getSingleAdmin);
router.post("/signup", deserializeAdmin, adminAuth, createAdmin);
router.post("/login", loginAdmin);
router.post("/check-token", deserializeAdmin, adminAuth, allowAccess);
router.put("/update-my-profile", deserializeAdmin, adminAuth, updateProfile);
router.put(
  "/update-password",
  deserializeAdmin,
  adminAuth,
  updateAdminPassword
);
export default router;
