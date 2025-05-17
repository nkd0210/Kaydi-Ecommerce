// tests/helpers/orderHelper.js
import Order from "../../models/orderModel.js";
import mongoose from "mongoose";

export async function createOrder(overrides = {}) {
  const defaultOrder = {
    userId: new mongoose.Types.ObjectId(),
    receiverName: "John Doe",
    receiverPhone: "0123456789",
    receiverNote: "Leave at the door",
    products: [
      {
        productId: new mongoose.Types.ObjectId(),
        name: "Sample Product",
        quantity: 2,
        price: 50000,
        color: "Red",
        size: "M",
        image: "sample.jpg",
      },
    ],
    totalAmount: 100000,
    shippingAddress: "123 Street, City, Country",
    paymentMethod: "COD",
  };

  return await Order.create({ ...defaultOrder, ...overrides });
}
