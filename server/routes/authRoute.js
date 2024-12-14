import express from "express";
import {
  signIn,
  signOut,
  signUp,
  google,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signin", signIn);
router.post("/signup", signUp);
router.post("/signout", signOut);
router.post("/google", google);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword/:token", resetPassword);

export default router;
