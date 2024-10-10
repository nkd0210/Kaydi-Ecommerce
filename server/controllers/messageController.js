import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import Chat from "../models/chatModel.js";
import { pusherServer } from "../lib/pusher.js";

export const getAllMessages = async (req, res, next) => {
  const { chatId } = req.params;

  const findChat = await Chat.findById(chatId);
  if (!findChat) {
    return res.status(404).json({ message: "Chat not found" });
  }
  try {
    const messages = await Message.find({ chat: chatId }).populate(
      "sender",
      "username profilePic"
    );
    // .populate({
    //   path: "chat",
    //   select: "chatName latestMessage latestMessageAt",
    // });

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

  const currentUser = await User.findById(req.user.id);

  var message = {
    sender: currentUser,
    content: content,
    chat: chatId,
    seenBy: req.user.id,
  };

  try {
    var newMessage = await Message.create(message);

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { messages: newMessage._id },
        $set: {
          latestMessage: newMessage,
          latestMessageAt: newMessage.createdAt,
        },
      },
      { new: true }
    )
      .populate({
        path: "messages",
        model: "Message",
        populate: [
          {
            path: "sender",
            select: "username profilePic",
          },
          {
            path: "seenBy",
            select: "username profilePic",
          },
        ],
      })
      .populate({
        path: "members",
        model: "User",
      })
      .populate({
        path: "latestMessage",
        model: "Message",
      });

    /* Trigger a Pusher event for a specific chat about the new message */
    await pusherServer.trigger(chatId, "new-message", newMessage);

    /* Triggers a Pusher event for each member of the chat about the chat update with the latest message */
    const latestMessage = updatedChat.messages[updatedChat.messages.length - 1];
    updatedChat.members.forEach(async (member) => {
      try {
        await pusherServer.trigger(member._id.toString(), "update-chat", {
          id: chatId,
          messages: [latestMessage],
        });
      } catch (error) {
        console.error("Failed to trigger update-chat event");
      }
    });

    return res.status(200).json(updatedChat);
  } catch (error) {
    next(error);
  }
};
