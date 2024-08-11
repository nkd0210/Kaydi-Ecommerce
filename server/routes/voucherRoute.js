import express from "express";
import { verifyToken } from "../utils/verifyUser.js";

import {
  createVoucher,
  getAllVouchers,
  getVoucherById,
  updateVoucher,
  deleteVoucher,
  applyVoucher,
} from "../controllers/voucherController.js";

const router = express.Router();

router.post("/create/:userId", verifyToken, createVoucher);
router.get("/getAllVouchers/:userId", verifyToken, getAllVouchers);
router.get("/getVoucherById/:userId/:voucherId", verifyToken, getVoucherById);
router.put("/updateVoucher/:userId/:voucherId", verifyToken, updateVoucher);
router.delete("/deleteVoucher/:userId/:voucherId", verifyToken, deleteVoucher);
router.post("/applyVoucher/:userId/:code", verifyToken, applyVoucher);

export default router;
