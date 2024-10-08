import { Router } from "express";
import addProduct from "../controllers/product/addProduct";
import getAllProducts from "../controllers/product/getAllProducts";
import getProduct from "../controllers/product/getProduct";
import adminAuth from "../middlewares/adminAuth";
import deleteProduct from "./../controllers/product/deleteProduct";
import updateProduct from "./../controllers/product/updateProduct";
import getTotalProductsCount from "./../controllers/product/getTotalProductsCount";
import getMonthlyStatistics from "./../controllers/product/getMonthlyStatistics";
import updateProductPrice from "./../controllers/product/updateProductPrice";
import deserializeAdmin from "../middlewares/deserializeAdmin";

const router = Router();

router.get("/", getAllProducts);
router.get(
  "/count-products",
  deserializeAdmin,
  adminAuth,
  getTotalProductsCount
);
router.get(
  "/monthly-statistics",
  deserializeAdmin,
  adminAuth,
  getMonthlyStatistics
);
router.get("/:productId", getProduct);
router.post("/", deserializeAdmin, adminAuth, addProduct);
router.put("/:productId", deserializeAdmin, adminAuth, updateProduct);
router.put(
  "/update-price/:productId",
  deserializeAdmin,
  adminAuth,
  updateProductPrice
);
router.delete("/:productId", deserializeAdmin, adminAuth, deleteProduct);

export default router;
