import { Router } from "express";
import adminAuth from "../middlewares/adminAuth";
import { storeImage } from "../middlewares/multerConfig";
import deserializeAdmin from "../middlewares/deserializeAdmin";
import getAdminImage from "../controllers/image/getAdminImage";
import updateProductImage from "../controllers/image/updateProductImage";
import updateAdminImage from "../controllers/image/updateAdminImage";
import deleteProductImage from "../controllers/image/deleteProductImage";
import deleteAdminImage from "../controllers/image/deleteAdminImage";
const router = Router();
router.get("/", deserializeAdmin, adminAuth, getAdminImage);
router.post(
  "/upload/product/:imageAngle/:productId",
  deserializeAdmin,
  adminAuth,
  storeImage,
  updateProductImage
);

router.post(
  "/upload/admin",
  deserializeAdmin,
  adminAuth,
  storeImage,
  updateAdminImage
);
router.delete(
  "/upload/product/:imageId",
  deserializeAdmin,
  adminAuth,
  deleteProductImage
);
router.delete("/upload/admin", deserializeAdmin, adminAuth, deleteAdminImage);
export default router;
