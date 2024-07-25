import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/getallusers", verifyToken, getAllUsers);
router.get("/getuser/:userId", verifyToken, getUser);
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);

export default router;
