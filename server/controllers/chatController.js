import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";

export const accessSingleChat = async (req, res, next) => {
  const { receiverId } = req.body;
  const userId = req.user.id;

  try {
    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { members: { $elemMatch: { $eq: userId } } }, // ng gui
        { members: { $elemMatch: { $eq: receiverId } } }, // ng nhan
      ],
    })
      .populate("members", "-password")
      .populate("latestMessage");

    // lay thong tin cua nguoi chat cuoi cung
    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "username email profilePic",
    });

    const findUser = await User.findById(receiverId); // lay thong tin cua nguoi muon chat cung

    if (isChat.length > 0) {
      return res.status(200).json({
        chat: isChat[0],
        receiver: findUser,
      });
    } else {
      var chatData = {
        isGroupChat: false,
        members: [userId, receiverId],
      };
      const newChat = await Chat.create(chatData);
      // after create new chat, find that chat and populate all the user information except password
      const populatedChat = await Chat.findOne({ _id: newChat._id }).populate(
        "members",
        "-password"
      );

      return res.status(200).json({
        // chat: populatedChat,
        receiver: findUser,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const accessGroupChat = async (req, res, next) => {
  const { groupChatId } = req.params;

  try {
    const findGroupChat = await Chat.findOne({
      _id: groupChatId,
      isGroupChat: true,
    })
      .populate("members", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage");

    if (!findGroupChat) {
      return res.status(404).json({ message: "Group chat not found" });
    }

    const populatedGroupChat = await User.populate(findGroupChat, {
      path: "latestMessage.sender",
      select: "username email profilePic",
    });

    return res.status(200).json(populatedGroupChat);
  } catch (error) {
    next(error);
  }
};

export const getAllChatsOfUser = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const allChats = await Chat.find({
      members: { $elemMatch: { $eq: userId } },
    })
      .populate("members", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    if (allChats.length === 0) {
      return res.json("This user dont have any chat yet");
    }

    const populatedChats = await User.populate(allChats, {
      path: "latestMessage.sender",
      select: "username email profilePic",
    });

    const chatsWithReceiver = populatedChats.map((chat) => {
      const filteredMembers = chat.members.filter(
        (member) => member._id.toString() !== userId
      );

      return {
        ...chat.toObject(),
        receiver: filteredMembers,
      };
    });

    return res.status(200).json(chatsWithReceiver);
  } catch (error) {
    next(error);
  }
};

export const createGroupChat = async (req, res, next) => {
  const { memberIds, chatName, groupPhoto } = req.body;
  const userId = req.user.id;

  if (!memberIds || !chatName) {
    return res.status(400).json({ message: "Please provide missing fields" });
  }

  const image =
    groupPhoto ||
    "https://static.vecteezy.com/system/resources/previews/021/631/109/original/low-poly-style-group-chat-logo-symbol-people-logo-sign-free-vector.jpg";

  if (memberIds.length < 2) {
    return res
      .status(400)
      .json({ message: "A group chat must have at least 2 users" });
  }

  const members = [userId, ...memberIds];

  try {
    const newGroupChat = await Chat.create({
      chatName: chatName,
      groupPhoto: image,
      members: members,
      isGroupChat: true,
      groupAdmin: userId,
    });

    const populatedGroupChat = await Chat.findOne({ _id: newGroupChat._id })
      .populate("members", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(populatedGroupChat);
  } catch (error) {
    next(error);
  }
};

export const updateGroupChat = async (req, res, next) => {
  const { groupChatId } = req.params;
  const { chatName, groupPhoto } = req.body;

  const findChat = await Chat.findById(groupChatId);
  if (!findChat) {
    return res.status(404).json({ message: "Chat not found" });
  }

  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      groupChatId,
      {
        $set: {
          chatName: chatName,
          groupPhoto: groupPhoto,
        },
      },
      { new: true }
    )
      .populate("members", "-password")
      .populate("groupAdmin", "-password");

    return res.status(200).json(updatedChat);
  } catch (error) {
    next(error);
  }
};

export const removeFromGroupChat = async (req, res, next) => {
  const { groupChatId } = req.params;
  const { userDeletedId } = req.body;

  const userId = req.user.id;

  const findChat = await Chat.findById(groupChatId);
  if (!findChat) {
    return res.status(404).json({ message: "Chat not found" });
  }

  if (findChat.groupAdmin._id.toString() !== userId) {
    return res.status(403).json({
      message: "You are not allowed to remove this user from this group chat",
    });
  }

  try {
    const removedFromChat = await Chat.findByIdAndUpdate(
      groupChatId,
      {
        $pull: { members: userDeletedId },
      },
      { new: true }
    )
      .populate("members", "-password")
      .populate("groupAdmin", "-password");

    return res.status(200).json(removedFromChat);
  } catch (error) {
    next(error);
  }
};

export const addToGroupChat = async (req, res, next) => {
  const { groupChatId } = req.params;
  const { userId } = req.body;

  const findChat = await Chat.findById(groupChatId);
  if (!findChat) {
    return res.status(404).json({ message: "Chat not found" });
  }

  try {
    const addedToChat = await Chat.findByIdAndUpdate(
      groupChatId,
      {
        $push: { members: userId },
      },
      { new: true }
    )
      .populate("members", "-password")
      .populate("groupAdmin", "-password");

    return res.status(200).json(addedToChat);
  } catch (error) {
    next(error);
  }
};
