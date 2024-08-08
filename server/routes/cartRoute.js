import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  addToCart,
  getUserCart,
  removeFromCart,
  updateUserCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/addToCart", verifyToken, addToCart);
router.delete("/removeFromCart", verifyToken, removeFromCart);
router.get("/getUserCart/:userId", verifyToken, getUserCart);
router.put("/updateUserCart/:userId", verifyToken, updateUserCart);

export default router;
