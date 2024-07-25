import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createOrder, getAllOrder } from "../controllers/orderController.js";

const router = express.Router();

router.post("/createOrder", verifyToken, createOrder);
router.get("/getAllOrders", verifyToken, getAllOrder);

export default router;
