import express from "express";
import {
  accessGroupChat,
  accessSingleChat,
  addToGroupChat,
  createGroupChat,
  getAllChatsOfUser,
  removeFromGroupChat,
  updateGroupChat,
} from "../controllers/chatController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/accessSingleChat", verifyToken, accessSingleChat);
router.post("/accessGroupChat/:groupChatId", verifyToken, accessGroupChat);
router.get("/getAllChatsOfUser", verifyToken, getAllChatsOfUser);
router.post("/createGroupChat", verifyToken, createGroupChat);
router.put("/updateGroupChat/:groupChatId", verifyToken, updateGroupChat);
router.put(
  "/removeFromGroupChat/:groupChatId",
  verifyToken,
  removeFromGroupChat
);
router.put("/addToGroupChat/:groupChatId", verifyToken, addToGroupChat);

export default router;
