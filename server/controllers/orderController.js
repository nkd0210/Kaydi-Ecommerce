import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
    const findUserOrder = await Order.find({ userId }).sort({ createdAt: -1 });
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

export const paymentWithStripe = async (req, res, next) => {
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

  if (paymentMethod === "COD") {
    return res
      .status(404)
      .json({ message: "This method does not need to pay by Stripe" });
  }

  const lineItems = products.map((product) => ({
    price_data: {
      currency: "vnd",
      product_data: {
        name: `${product.name} - ${product.size} - ${product.color}`,
        images: [product.image],
        metadata: {
          color: product.color,
          size: product.size,
        },
      },
      unit_amount: product.price,
    },
    quantity: product.quantity,
  }));
  try {
    // tuong tu nhu new Order({}) + await newOrder.save()
    const newOrder = await Order.create({
      userId,
      receiverName,
      receiverPhone,
      receiverNote,
      products,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentCheck: false,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["VN"],
      },
      shipping_options: [
        {
          shipping_rate: "shr_1PnhJ3ELWvlzH2IqYGJRn3KR", // free ship
          // shipping_rate: "shr_1PnhI3ELWvlzH2IqQxOkTi8p", //ship
        },
      ],
      line_items: lineItems,
      client_reference_id: userId,
      success_url: `${process.env.ECOMMERCE_STORE_URL}/paymentSuccess/${newOrder._id}`,
      cancel_url: `${process.env.ECOMMERCE_STORE_URL}/cart`,
      metadata: {
        receiverName,
        receiverPhone,
        receiverNote,
        shippingAddress,
        totalAmount,
      },
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    next(error);
  }
};

export const updateOrderPaymentCheck = async (req, res, next) => {
  const { orderId } = req.params;

  try {
    const findOrder = await Order.findById(orderId);
    if (!findOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    findOrder.paymentCheck = true;
    await findOrder.save();
    res.status(200).json(findOrder);
  } catch (error) {
    next(error);
  }
};
