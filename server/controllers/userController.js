import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";

export const getAllUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return res
      .status(401)
      .json({ message: "You dont have permission to do this action" });
  }
  try {
    const allUsers = await User.find();

    const users = allUsers.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const userCount = await User.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    if (allUsers.length === 0) {
      return res.status(404).json({ message: "No users were found" });
    }
    res.status(200).json({
      userCount,
      lastMonthUsers,
      users,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  const userId = req.params.userId;
  const findUser = await User.findById(userId);
  if (!findUser) {
    return res.status(404).json({ message: "User not found" });
  }
  const { password: pass, ...rest } = findUser._doc;
  return res.status(200).json(rest);
};

export const updateUser = async (req, res, next) => {
  const userId = req.params.userId;
  if (req.user.id !== userId) {
    return res
      .status(401)
      .json({ message: "You dont have permission to do this action" });
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }
    req.body.password = bcryptjs.hashSync(req.body.password);
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          gender: req.body.gender,
          phoneNumber: req.body.phoneNumber,
          dateOfBirth: req.body.dateOfBirth,
          addressList: req.body.addressList,
          profilePic: req.body.profilePic,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    return res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  const userId = req.params.userId;
  if (req.user.id !== userId) {
    return res
      .status(401)
      .json({ message: "You dont have permission to do this action" });
  }
  try {
    await User.findByIdAndDelete(userId);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};