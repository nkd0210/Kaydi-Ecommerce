/**
 * @jest-environment node
 */
const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");

const {
  connect,
  closeDatabase,
  clearDatabase,
} = require("../setup/mongoMemoryServer");

const orderController = require("../../controllers/orderController");
const Order = require("../../models/orderModel").default;
const Product = require("../../models/productModel").default;

const app = express();
app.use(express.json());

const userId = new mongoose.Types.ObjectId();

// Simulated auth middleware
app.use((req, res, next) => {
  req.user = { id: userId.toString(), isAdmin: false };
  next();
});

app.post("/orders", orderController.createOrder);
app.get("/orders/all", orderController.getAllOrder);
app.put("/orders/edit/:orderId", orderController.editOrder);
app.delete("/orders/cancel/:userId/:orderId", orderController.cancelOrder);
app.get("/orders/user/:userId", orderController.getUserOrder);
app.get("/orders/id/:orderId", orderController.getOrderById);
app.put(
  "/orders/payment-check/:orderId",
  orderController.updateOrderPaymentCheck
);

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

describe("OrderController › createOrder", () => {
  test("#TC001 - create order successfully with COD", async () => {
    const product = await Product.create({
      name: "Test Shirt",
      price: 100000,
      stock: 5,
    });

    const orderPayload = {
      userId: userId.toString(),
      receiverName: "Alice",
      receiverPhone: "0123456789",
      receiverNote: "Leave at door",
      products: [
        {
          productId: product._id.toString(),
          name: "Test Shirt",
          quantity: 2,
          price: 100000,
          color: "Red",
          size: "M",
          image: "image.jpg",
        },
      ],
      totalAmount: 200000,
      shippingAddress: "123 Main St",
      paymentMethod: "COD",
    };

    const res = await request(app).post("/orders").send(orderPayload);
    expect(res.status).toBe(200);
    expect(res.body.receiverName).toBe("Alice");

    const updatedProduct = await Product.findById(product._id);
    expect(updatedProduct.stock).toBe(3);
  });

  test("#TC002 - create order with insufficient stock", async () => {
    const product = await Product.create({
      name: "Limited Shirt",
      price: 50000,
      stock: 1,
    });

    const res = await request(app)
      .post("/orders")
      .send({
        userId: userId.toString(),
        receiverName: "Bob",
        receiverPhone: "0987654321",
        receiverNote: "",
        products: [
          {
            productId: product._id.toString(),
            name: "Limited Shirt",
            quantity: 2,
            price: 50000,
            color: "Blue",
            size: "L",
            image: "image.jpg",
          },
        ],
        totalAmount: 100000,
        shippingAddress: "456 Market St",
        paymentMethod: "COD",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Not enough stock");
  });

  test("#TC003 - create order with non-existing product", async () => {
    const res = await request(app)
      .post("/orders")
      .send({
        userId: userId.toString(),
        receiverName: "Charlie",
        receiverPhone: "0909090909",
        receiverNote: "",
        products: [
          {
            productId: new mongoose.Types.ObjectId().toString(),
            name: "Ghost Product",
            quantity: 1,
            price: 100000,
            color: "White",
            size: "S",
            image: "ghost.jpg",
          },
        ],
        totalAmount: 100000,
        shippingAddress: "789 Ghost Rd",
        paymentMethod: "COD",
      });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Product not found");
  });

  test("#TC004 - create order with unsupported payment method", async () => {
    const product = await Product.create({
      name: "Stripe Shirt",
      price: 120000,
      stock: 5,
    });

    const res = await request(app)
      .post("/orders")
      .send({
        userId: userId.toString(),
        receiverName: "Stripe User",
        receiverPhone: "0111111111",
        receiverNote: "",
        products: [
          {
            productId: product._id.toString(),
            name: "Stripe Shirt",
            quantity: 1,
            price: 120000,
            color: "Black",
            size: "XL",
            image: "stripe.jpg",
          },
        ],
        totalAmount: 120000,
        shippingAddress: "123 Stripe Blvd",
        paymentMethod: "Stripe",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Other function are not supported");
  });

  test("#TC005 - create order - unauthenticated user", async () => {
    const noAuthApp = express();
    noAuthApp.use(express.json());
    noAuthApp.use((req, res, next) => {
      req.user = null;
      next();
    });
    noAuthApp.post("/orders", orderController.createOrder);

    const res = await request(noAuthApp).post("/orders").send({
      userId: "fake",
      receiverName: "Anon",
      receiverPhone: "0000000000",
      products: [],
      totalAmount: 0,
      shippingAddress: "Nowhere",
      paymentMethod: "COD",
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("You are not logged in");
  });

  test("#TC006 - get user orders with no orders", async () => {
    const res = await request(app).get(`/orders/user/${userId}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("No order found for this user");
  });

  test("#TC007 - get order by ID - not found", async () => {
    const res = await request(app).get(
      `/orders/id/${new mongoose.Types.ObjectId()}`
    );
    expect(res.status).toBe(404);
    expect(res.body.message).toBeDefined();
  });

  test("#TC008 - update payment check - not found", async () => {
    const res = await request(app).put(
      `/orders/payment-check/${new mongoose.Types.ObjectId()}`
    );
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Order not found");
  });
  test("#TC009 - invalid phone length", async () => {
    const product = await Product.create({
      name: "Test Shirt",
      price: 100000,
      stock: 5,
    });

    const orderPayload = {
      userId: userId.toString(),
      receiverName: "Alice",
      receiverPhone: "01234", // too short
      receiverNote: "Leave at door",
      products: [
        {
          productId: product._id.toString(),
          name: "Test Shirt",
          quantity: 1,
          price: 100000,
          color: "Red",
          size: "M",
          image: "image.jpg",
        },
      ],
      totalAmount: 100000,
      shippingAddress: "123 Main St",
      paymentMethod: "COD",
    };

    const res = await request(app).post("/orders").send(orderPayload);
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch("Invalid phone number length");
  });

  test("#TC010 - non-numeric phone number", async () => {
    const product = await Product.create({
      name: "Test Shirt",
      price: 100000,
      stock: 5,
    });

    const orderPayload = {
      userId: userId.toString(),
      receiverName: "Bob",
      receiverPhone: "01234ABC89", // contains letters
      receiverNote: "Urgent",
      products: [
        {
          productId: product._id.toString(),
          name: "Test Shirt",
          quantity: 1,
          price: 100000,
          color: "Blue",
          size: "L",
          image: "image.jpg",
        },
      ],
      totalAmount: 100000,
      shippingAddress: "456 Main St",
      paymentMethod: "COD",
    };

    const res = await request(app).post("/orders").send(orderPayload);
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(
      "Phone number contains digital numbers only"
    );
  });
});
