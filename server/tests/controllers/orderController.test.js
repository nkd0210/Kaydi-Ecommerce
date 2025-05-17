/**
 * @jest-environment node
 */

const request = require("supertest");
const express = require("express");
const orderController = require("../../controllers/orderController");
const {
  connect,
  clearDatabase,
  closeDatabase,
} = require("../setup/mongoMemoryServer");
const { createOrderPayload, createOrder } = require("../helpers/orderHelper");
const { createAdminUser } = require("../helpers/userHelper");

const app = express();
app.use(express.json());

let admin;

beforeAll(async () => {
  await connect();
  admin = await createAdminUser();

  app.use((req, res, next) => {
    req.user = {
      id: admin._id.toString(),
      isAdmin: true,
    };
    next();
  });

  app.get("/orders", orderController.getAllOrder);
  app.get("/orders/export", orderController.exportOrders);
  app.post("/orders", orderController.createOrder);
  app.put("/orders/:orderId", orderController.editOrder);
  app.delete("/orders/:userId/:orderId", orderController.cancelOrder);
  app.get("/orders/user/:userId", orderController.getUserOrder);
  app.get("/orders/detail/:orderId", orderController.getOrderById);
  app.patch(
    "/orders/payment/:orderId",
    orderController.updateOrderPaymentCheck
  );
  app.get("/orders/revenue/daily", orderController.getTotalAmountPerDay);
  app.get("/orders/revenue/monthly", orderController.getTotalAmountPerMonth);
  app.get("/orders/status-summary", orderController.getAllOrderStatus);
  app.get("/orders/revenue/summary", orderController.getOrderTotalRevenue);
  app.get("/orders/by-customer", orderController.getAllOrdersOfCustomer);
  app.get("/orders/admin-search/:searchKey", orderController.searchOrderAdmin);
});

afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

describe("OrderController Integration", () => {
  test("#TC001 - should create an order with COD method", async () => {
    const payload = await createOrderPayload(admin._id); // Just the payload, not saved yet

    const res = await request(app).post("/orders").send(payload);

    if (res.status !== 200) {
      console.error("❌ Failed with:", res.body);
    }

    expect(res.status).toBe(200);
    expect(res.body.totalAmount).toBe(payload.totalAmount);
    expect(res.body.paymentMethod).toBe("COD");
  });

  test("#TC002 - should get all orders (paginated)", async () => {
    await request(app)
      .post("/orders")
      .send(await createOrderPayload(admin._id));
    const res = await request(app).get("/orders?page=1&limit=5");
    expect(res.status).toBe(200);
    expect(res.body.numberOfOrder).toBeGreaterThanOrEqual(1);
  });

  test("#TC003 - should export orders to Excel", async () => {
    await request(app)
      .post("/orders")
      .send(await createOrderPayload(admin._id));
    const res = await request(app).get("/orders/export");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("spreadsheetml");
  });

  test("#TC004 - should update order status to processing", async () => {
    const payload = await createOrderPayload(admin._id);
    const createRes = await request(app).post("/orders").send(payload);
    const orderId = createRes.body._id;
    const res = await request(app)
      .put(`/orders/${orderId}`)
      .send({ status: "processing" });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("processing");
  });

  test("#TC005 - should cancel an order", async () => {
    const payload = await createOrderPayload(admin._id);
    const createRes = await request(app).post("/orders").send(payload);
    const orderId = createRes.body._id;
    const res = await request(app).delete(`/orders/${admin._id}/${orderId}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toContain("Order canceled successfully");
  });

  test("#TC006 - should get user orders", async () => {
    const payload = await createOrderPayload(admin._id);
    await request(app).post("/orders").send(payload);
    const res = await request(app).get(`/orders/user/${admin._id}`);
    expect(res.status).toBe(200);
    expect(res.body.totalOrders).toBeGreaterThanOrEqual(1);
  });

  test("#TC007 - should get order detail by ID", async () => {
    const payload = await createOrderPayload(admin._id);
    const { body } = await request(app).post("/orders").send(payload);
    const res = await request(app).get(`/orders/detail/${body._id}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(body._id);
  });

  test("#TC008 - should update paymentCheck to true", async () => {
    // Create the order directly in the database
    const order = await createOrder(admin._id);

    // Now call the PATCH endpoint to update paymentCheck
    const res = await request(app).patch(`/orders/payment/${order._id}`);

    expect(res.status).toBe(200);
    expect(res.body.paymentCheck).toBe(true);
  });
});
