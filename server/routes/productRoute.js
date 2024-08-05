import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getEachProduct,
  getProductByCategory,
  getRecentProduct,
  updateProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.post("/create", verifyToken, createProduct);
router.get("/getRecentProduct/:limitNumber", getRecentProduct);
router.get("/getAllProduct", getAllProduct);
router.put("/update/:productId", verifyToken, updateProduct);
router.delete("/delete/:productId", verifyToken, deleteProduct);
router.get("/getByCategory/:category", getProductByCategory);
router.get("/getEachProduct/:productId", getEachProduct);

export default router;