import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  addToCart,
  getItemsInCart,
  getUserCart,
  removeFromCart,
  updateUserCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/addToCart", verifyToken, addToCart);
router.delete("/removeFromCart", verifyToken, removeFromCart);
router.get("/getUserCart/:userId", verifyToken, getUserCart);
router.put("/updateUserCart/:userId", verifyToken, updateUserCart);
router.get("/getItemInCart", verifyToken, getItemsInCart);

export default router;
