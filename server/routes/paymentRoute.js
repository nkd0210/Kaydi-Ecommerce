import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createPaymentZaloPay,
  paymentZaloPaySuccess,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/createPaymentZaloPay", verifyToken, createPaymentZaloPay);
router.post("/paymentZaloPaySuccess", verifyToken, paymentZaloPaySuccess);

export default router;
