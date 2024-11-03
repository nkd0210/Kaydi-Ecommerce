import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createProduct,
  deleteProduct,
  exportProducts,
  getAllProduct,
  getEachProduct,
  getProductByCategory,
  getProductByFilter,
  getProductBySearch,
  getProductPagination,
  getRecentProduct,
  getRecommendProducts,
  updateProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.post("/create", verifyToken, createProduct);
router.get("/getRecentProduct/:limitNumber", getRecentProduct);
router.get("/getAllProduct", getAllProduct);
router.get("/getProductPagination", getProductPagination);
router.put("/update/:productId", verifyToken, updateProduct);
router.delete("/delete/:productId", verifyToken, deleteProduct);
router.get("/getByCategory/:category", getProductByCategory);
router.get("/getEachProduct/:productId", getEachProduct);
router.get("/getProductBySearch/:searchKey", getProductBySearch);
router.post("/getProductByFilter/:filterType", getProductByFilter);
router.get("/exportProducts", verifyToken, exportProducts);
router.get("/getRecommendProduct/:productId", getRecommendProducts);

export default router;
