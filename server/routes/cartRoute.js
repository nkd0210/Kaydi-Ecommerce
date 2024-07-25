import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { addToCart } from "../controllers/cartController.js";

const router = express.Router();

router.post("/addToCart", verifyToken, addToCart);

export default router;
