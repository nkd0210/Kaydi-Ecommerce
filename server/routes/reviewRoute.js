import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createReview,
  deleteProductReview,
  editReview,
  getProductReview,
  getUserReview,
  replyReview,
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/createReview/:userId", verifyToken, createReview);
router.get("/getProductReview/:productId", getProductReview);
router.delete("/deleteReview/:reviewId", verifyToken, deleteProductReview);
router.put("/updateReview/:reviewId", verifyToken, editReview);
router.get("/getUserReview/:userId", verifyToken, getUserReview);
router.post("/replyReview/:reviewId", verifyToken, replyReview);

export default router;
