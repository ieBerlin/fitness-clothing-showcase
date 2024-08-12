import { Router } from "express";
import addProduct from "../controllers/product/addProduct";
import getAllProducts from "../controllers/product/getAllProducts";
import getProduct from "../controllers/product/getProduct";
import deserializeUser from "../middlewares/deserializeUser";
import adminAuth from "../middlewares/adminAuth";
import deleteProduct from './../controllers/product/deleteProduct';
import updateProduct from './../controllers/product/updateProduct';

const router = Router();

router.get("/", getAllProducts);
router.get("/:productId", getProduct);
router.post("/", deserializeUser, adminAuth, addProduct);
router.put("/:productId", deserializeUser, adminAuth, updateProduct);
router.delete("/:productId", deserializeUser, adminAuth, deleteProduct);

export default router;
