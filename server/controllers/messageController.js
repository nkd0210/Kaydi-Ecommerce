import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import Chat from "../models/chatModel.js";

export const getAllMessages = async (req, res, next) => {
  const { chatId } = req.params.chatId;

  const findChat = await Chat.findById(chatId);
  if (!findChat) {
    return res.status(404).json({ message: "Chat not found" });
  }
  try {
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "username email profilePic")
      .populate("chat");

    return res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  const { chatId, content } = req.body;

  if (!chatId || !content) {
    return res
      .status(400)
      .json({ message: "Chat ID and content are required" });
  }

  var newMessage = {
    sender: req.user.id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "username profilePic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "username email profilePic",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    return res.status(200).json(message);
  } catch (error) {
    next(error);
  }
};
