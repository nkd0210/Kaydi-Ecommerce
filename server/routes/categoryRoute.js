import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createCategory,
  deleteCategory,
  exportCategories,
  getAllCategories,
  getCategoriesFromNewest,
  getCategoryByName,
  getEachCategory,
  updateCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/create", verifyToken, createCategory);
router.get("/getAllCategories", getAllCategories);
router.get("/getCategoriesFromNewest", getCategoriesFromNewest);
router.delete("/delete/:categoryId", verifyToken, deleteCategory);
router.put("/update/:categoryId", verifyToken, updateCategory);
router.get("/getEachCategory/:categoryId", verifyToken, getEachCategory);
router.get("/getCategoryByName/:name", getCategoryByName);
router.get("/exportCategories", verifyToken, exportCategories);

export default router;
