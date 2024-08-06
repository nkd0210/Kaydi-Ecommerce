import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  addToCart,
  getUserCart,
  removeFromCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/addToCart", verifyToken, addToCart);
router.delete("/removeFromCart", verifyToken, removeFromCart);
router.get("/getUserCart", verifyToken, getUserCart);

export default router;
