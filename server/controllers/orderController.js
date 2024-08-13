import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";

export const createOrder = async (req, res, next) => {
  if (!req.user.id) {
    return res.status(401).json({ message: "You are not logged in" });
  }
  const {
    userId,
    receiverName,
    receiverPhone,
    receiverNote,
    products,
    totalAmount,
    shippingAddress,
    paymentMethod,
  } = req.body;

  try {
    if (paymentMethod !== "COD") {
      return res
        .status(400)
        .json({ message: "Other function are not supported" });
    }

    const newOrder = new Order({
      userId,
      receiverName,
      receiverPhone,
      receiverNote,
      products,
      totalAmount,
      shippingAddress,
      paymentMethod,
    });

    await newOrder.save();
    res.status(200).json(newOrder);
  } catch (error) {
    next(error);
  }
};

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
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const findOrder = await Order.find().populate("userId products.productId");

    if (findOrder.length === 0) {
      return res.status(404).json({ message: "No order found" });
    }

    // Count orders for specific timeframes
    const [todayOrder, lastWeekOrder, lastMonthOrder] = await Promise.all([
      Order.find({ createdAt: { $gte: today } }).countDocuments(),
      Order.find({ createdAt: { $gte: oneWeekAgo } }).countDocuments(),
      Order.find({ createdAt: { $gte: oneMonthAgo } }).countDocuments(),
    ]);

    res.status(200).json({
      numberOfOrder: findOrder.length,
      todayOrder,
      lastWeekOrder,
      lastMonthOrder,
      findOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const editOrder = async (req, res, next) => {
  const { orderId } = req.params;
  const {
    receiverName,
    receiverPhone,
    receiverNote,
    products,
    totalAmount,
    shippingAddress,
    paymentMethod,
  } = req.body;
  if (!req.user.isAdmin) {
    return res
      .status(401)
      .json({ message: "You are not admin to edit this order" });
  }
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: {
          receiverName,
          receiverPhone,
          receiverNote,
          products,
          totalAmount,
          shippingAddress,
          paymentMethod,
        },
      },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  const { userId, orderId } = req.params;
  if (!req.user.id) {
    return res.status(401).json({ message: "You are not logged in" });
  }
  try {
    const findOrder = await Order.findById(orderId);
    if (!findOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (findOrder.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to cancel this order" });
    }
    if (findOrder.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Order is in processing, can not be cancel!" });
    }
    await Order.findByIdAndDelete(orderId);
    res.status(200).json({ message: "Order canceled successfully" });
  } catch (error) {
    next(error);
  }
};

export const getUserOrder = async (req, res, next) => {
  const { userId } = req.params;
  if (req.user.id !== userId) {
    return res
      .status(401)
      .json({ message: "You are not authorized to get this user order " });
  }
  try {
    const findUserOrder = await Order.find({ userId });
    if (findUserOrder.length === 0) {
      return res.status(404).json({ message: "No order found for this user" });
    }
    res.status(200).json(findUserOrder);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  const { orderId } = req.params;
  if (!req.user.id) {
    return res.status(401).json({ message: "You are not logged in" });
  }
  try {
    const findOrder = await Order.findById(orderId).populate("userId products");
    if (findOrder.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(findOrder);
  } catch (error) {
    next(error);
  }
};
