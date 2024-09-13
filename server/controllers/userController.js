import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import ExcelJS from "exceljs";

export const getAllUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return res
      .status(401)
      .json({ message: "You dont have permission to do this action" });
  }
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const allUsers = await User.find().skip(skip).limit(limit);

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
    const oneWeekAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 7
    );

    const lastWeekUsers = await User.find({
      createdAt: { $gte: oneWeekAgo },
    });

    const lastMonthUsers = await User.find({
      createdAt: { $gte: oneMonthAgo },
    });

    if (allUsers.length === 0) {
      return res.status(404).json({ message: "No users were found" });
    }

    const totalPages = Math.ceil(userCount / limit);

    res.status(200).json({
      userCount,
      lastWeekUsersCount: lastWeekUsers.length,
      lastMonthUsersCount: lastMonthUsers.length,
      currentPage: page,
      totalPages,
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

export const exportToExcel = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return res
      .status(401)
      .json({ message: "You are not allowed to export users" });
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Users");

  // define columns
  worksheet.columns = [
    { header: "User ID", key: "_id", width: 24 },
    { header: "Username", key: "username", width: 20 },
    { header: "Email", key: "email", width: 30 },
    { header: "Phone Number", key: "phoneNumber", width: 15 },
    { header: "Gender", key: "gender", width: 10 },
    { header: "Date of Birth", key: "dateOfBirth", width: 15 },
    { header: "Addresses", key: "addressList", width: 40 },
    { header: "Is Admin", key: "isAdmin", width: 10 },
    { header: "Created At", key: "createdAt", width: 20 },
    { header: "Updated At", key: "updatedAt", width: 20 },
  ];

  try {
    const users = await User.find();

    users.forEach((user) => {
      const addressList = user.addressList?.join(", ") || "";

      worksheet.addRow({
        _id: user._id.toString(),
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber || "",
        gender: user.gender || "",
        dateOfBirth: user.dateOfBirth || "",
        addressList,
        isAdmin: user.isAdmin ? "Yes" : "No",
        createdAt: new Date(user.createdAt).toLocaleDateString(),
        updatedAt: new Date(user.updatedAt).toLocaleDateString(),
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=users.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error exporting users to Excel:", error);
    res.status(500).send("Failed to export users to Excel");
  }
};
