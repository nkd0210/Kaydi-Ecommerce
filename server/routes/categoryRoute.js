import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getEachCategory,
  updateCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/create", verifyToken, createCategory);
router.get("/getAllCategories", getAllCategories);
router.delete("/delete/:categoryId", verifyToken, deleteCategory);
router.put("/update/:categoryId", verifyToken, updateCategory);
router.get("/getEachCategory/:categoryId", verifyToken, getEachCategory);

export default router;