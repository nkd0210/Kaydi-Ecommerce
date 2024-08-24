import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receiverName: {
      type: String,
      required: true,
    },
    receiverPhone: {
      type: String,
      required: true,
    },
    receiverNote: {
      type: String,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        color: {
          type: String,
          required: true,
        },
        size: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          // required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered"],
      default: "pending", // pending -> processing -> shipped -> delivered
    },
    processingTime: {
      type: Date,
    },
    shippedTime: {
      type: Date,
    },
    deliveredTime: {
      type: Date,
    },
    shippingAddress: {
      type: String,
      required: true,
      default: "",
    },
    paymentMethod: {
      type: String,
      required: true,
      default: "",
    },
    paymentCheck: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
