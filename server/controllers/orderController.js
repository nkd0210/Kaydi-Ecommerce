import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";

export const createOrder = async (req, res, next) => {};

export const getAllOrder = async (req, res, next) => {
  if (!req.user.id) {
    return res.status(401).json({ message: "You are not logged in" });
  }
  try {
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
    const oneDayAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 1
    );
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const findOrder = await Order.find().populate("userId productId");
    const numberOfOrder = findOrder.length;

    if (findOrder.length === 0) {
      return res.status(404).json({ message: "No order found" });
    }

    const todayOrder = await Order.find({
      createdAt: { $gte: today },
    });

    const lastWeekOrder = await Order.find({
      createdAt: { $gte: oneWeekAgo },
    });

    const lastMonthOrder = await Order.find({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      numberOfOrder,
      todayOrder: todayOrder.length,
      lastWeekOrder: lastWeekOrder.length,
      lastMonthOrder: lastMonthOrder.length,
      findOrder,
    });
  } catch (error) {
    next(error);
  }
};
