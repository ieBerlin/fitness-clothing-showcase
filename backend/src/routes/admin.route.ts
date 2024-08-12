import { Router } from "express";
import createAdmin from "../controllers/auth/createAdmin";
// import updateAdmin from "../controllers/admin/updateAdmin";
import loginAdmin from "../controllers/auth/loginAdmin";
import deserializeUser from "../middlewares/deserializeUser";
import adminAuth from "../middlewares/adminAuth";

const router = Router();

router.post("/signup", deserializeUser, adminAuth, createAdmin);
router.post("/login", deserializeUser, adminAuth, loginAdmin);
// router.put("/update-profile", deserializeUser, adminAuth, updateAdmin);

export default router;
