import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  deleteUser,
  exportToExcel,
  getAllUsers,
  getAllUserToChat,
  getUser,
  getUserToAddInGroupChat,
  searchUser,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/getallusers", verifyToken, getAllUsers);
router.get("/getuser/:userId", verifyToken, getUser);
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.get("/exportUser", verifyToken, exportToExcel);
router.get("/searchUser", verifyToken, searchUser);
router.get("/getAllUsersToChat", verifyToken, getAllUserToChat);
router.get(
  "/getUserToAddInGroupChat/:chatId",
  verifyToken,
  getUserToAddInGroupChat
);

export default router;
