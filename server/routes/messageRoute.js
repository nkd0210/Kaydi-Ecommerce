import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  getAllMessages,
  sendMessage,
} from "../controllers/messageController.js";

const router = express.Router();

router.get("/getAllMessages/:chatId", verifyToken, getAllMessages);
router.post("/sendMessage", verifyToken, sendMessage);

export default router;
