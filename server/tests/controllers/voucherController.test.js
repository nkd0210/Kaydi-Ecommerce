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

const Product = require("../../models/productModel").default;
const voucherController = require("../../controllers/voucherController");
const { createVoucher } = require("../helpers/voucherHelper");

const app = express();
app.use(express.json());

let adminId;

// Middleware to simulate authenticated admin user
app.use((req, res, next) => {
  req.user = { id: adminId.toString(), isAdmin: true };
  next();
});

// Routes
app.post("/vouchers/:userId", voucherController.createVoucher);
app.get("/vouchers/:userId", voucherController.getAllVouchers);
app.get(
  "/vouchers/detail/:userId/:voucherId",
  voucherController.getVoucherById
);
app.put("/vouchers/:userId/:voucherId", voucherController.updateVoucher);
app.delete("/vouchers/:userId/:voucherId", voucherController.deleteVoucher);
app.post("/vouchers/apply/:userId/:code", voucherController.applyVoucher);
app.get(
  "/vouchers/by-products/:productIds",
  voucherController.getVoucherByProductIds
);
app.get("/vouchers/export/all", voucherController.exportVouchers);
app.get("/vouchers/statistic/all", voucherController.getVoucherStatistic);

beforeAll(async () => {
  await connect();
  adminId = new mongoose.Types.ObjectId();
});
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

describe("VoucherController Integration", () => {
  test("#TC001 - should create a new voucher", async () => {
    const res = await request(app)
      .post(`/vouchers/${adminId}`)
      .send(
        await createVoucher({
          code: "SALE10",
          usageLimit: 2,
        })
      );
    expect(res.status).toBe(201);
    expect(res.body.code).toBe("SALE10");
  });

  test("#TC002 - should get all vouchers", async () => {
    await createVoucher({ code: "CODEX", discount: 15 });
    const res = await request(app).get(`/vouchers/${adminId}`);
    expect(res.status).toBe(200);
    expect(res.body.totalVouchers).toBe(1);
  });

  test("#TC003 - should update a voucher", async () => {
    const voucher = await createVoucher({ code: "UPDATE", discount: 5 });
    const res = await request(app)
      .put(`/vouchers/${adminId}/${voucher._id}`)
      .send({ code: "UPDATED", discount: 20 });
    expect(res.status).toBe(200);
    expect(res.body.code).toBe("UPDATED");
  });

  test("#TC004 - should apply a voucher to valid products", async () => {
    const product = await Product.create({
      name: "Shirt",
      price: 100,
      stock: 10,
    });
    const voucher = await createVoucher({
      code: "DISCOUNT",
      applyProducts: [product._id],
    });
    const res = await request(app)
      .post(`/vouchers/apply/${adminId}/DISCOUNT`)
      .send({ productIds: [product._id.toString()], categories: [] });
    expect(res.status).toBe(200);
    expect(res.body.message).toContain("successfully");
  });

  test("#TC005 - should delete a voucher", async () => {
    const voucher = await createVoucher({ code: "DELETE" });
    const res = await request(app).delete(
      `/vouchers/${adminId}/${voucher._id}`
    );
    expect(res.status).toBe(200);
    expect(res.body.message).toContain("deleted successfully");
  });

  test("#TC006 - should return voucher statistic (most/least used)", async () => {
    await createVoucher({ code: "TOP1", usedCount: 5 });
    await createVoucher({ code: "LOW1", usedCount: 1 });
    const res = await request(app).get("/vouchers/statistic/all");
    expect(res.status).toBe(200);
    expect(res.body.mostUsed.code).toBe("TOP1");
    expect(res.body.leastUsed.code).toBe("LOW1");
  });
});
