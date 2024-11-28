import express from "express";
import { verifyToken } from "../utils/verifyUser.js";

import {
  createVoucher,
  getAllVouchers,
  getVoucherById,
  updateVoucher,
  deleteVoucher,
  applyVoucher,
  getVoucherByProductIds,
  exportVouchers,
  getVoucherStatistic,
} from "../controllers/voucherController.js";

const router = express.Router();

router.post("/create/:userId", verifyToken, createVoucher);
router.get("/getAllVouchers/:userId", verifyToken, getAllVouchers);
router.get("/getVoucherById/:userId/:voucherId", verifyToken, getVoucherById);
router.put("/updateVoucher/:userId/:voucherId", verifyToken, updateVoucher);
router.delete("/deleteVoucher/:userId/:voucherId", verifyToken, deleteVoucher);
router.post("/applyVoucher/:userId/:code", verifyToken, applyVoucher);
router.get(
  "/getVoucherByProductIds/:productIds",
  verifyToken,
  getVoucherByProductIds
);
router.get("/exportVouchers", verifyToken, exportVouchers);
router.get("/getVoucherStatistic", verifyToken, getVoucherStatistic);

export default router;
