import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createOrder,
  cancelOrder,
  editOrder,
  getAllOrder,
  getOrderById,
  getUserOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/createOrder", verifyToken, createOrder);
router.get("/getAllOrders", verifyToken, getAllOrder);
router.put("/editOrder/:orderId", verifyToken, editOrder);
router.delete("/cancelOrder/:userId/:orderId", verifyToken, cancelOrder);
router.get("/getUserOrder/:userId", verifyToken, getUserOrder);
router.get("/getOrderById/:orderId", verifyToken, getOrderById);

export default router;
