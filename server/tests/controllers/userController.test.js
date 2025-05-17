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
} = require("../setup/mongoMemoryServer.js");

const userController = require("../../controllers/userController.js");
const { createUser } = require("../helpers/userHelper.js");

const app = express();
app.use(express.json());

// Middleware to simulate authenticated admin user
let currentUserId;
app.use((req, res, next) => {
  req.user = {
    id: currentUserId,
    isAdmin: true,
  };
  next();
});

// Routes
app.get("/users", userController.getAllUsers);
app.get("/users/chat", userController.getAllUserToChat);
app.get("/users/chat/group/:chatId", userController.getUserToAddInGroupChat);
app.put("/users/:userId", userController.updateUser);
app.delete("/users/:userId", userController.deleteUser);
app.get("/users/export", userController.exportToExcel);
app.get("/users/search", userController.searchUser);
app.get("/users/:userId", userController.getUser);
app.get("/users/admin-search/:searchKey", userController.searchUserAdmin);

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

describe("UserController Integration", () => {
  test("#TC001 - should get all users", async () => {
    await createUser();
    const res = await request(app).get("/users");
    expect(res.status).toBe(200);
    expect(res.body.users.length).toBe(1);
  });

  test("#TC002 - should get a user by ID", async () => {
    const user = await createUser();
    const res = await request(app).get(`/users/${user._id}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe(user.email);
  });

  test("#TC003 - should update user info", async () => {
    const user = await createUser();
    currentUserId = user._id.toString();

    const res = await request(app)
      .put(`/users/${user._id}`)
      .send({ username: "BobUpdated" });

    expect(res.status).toBe(200);
    expect(res.body.username).toBe("BobUpdated");
  });

  test("#TC004 - should delete user", async () => {
    const user = await createUser();
    currentUserId = user._id.toString();

    const res = await request(app).delete(`/users/${user._id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User deleted successfully");
  });

  test("#TC005 - should export users to Excel", async () => {
    await createUser();
    const res = await request(app).get("/users/export");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain(
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
  }, 15000); // Tăng timeout lên 15 giây

  test("#TC006 - should search users by username/email", async () => {
    const user = await createUser({ username: "SearchMe" });
    const res = await request(app).get("/users/search?search=SearchMe");
    expect(res.status).toBe(200);
    expect(res.body[0].username).toBe("SearchMe");
  });

  test("#TC007 - should allow admin to search by ID or name", async () => {
    const user = await createUser({ username: "AdminSearch" });
    const res = await request(app).get(`/users/admin-search/${user._id}`);
    expect(res.status).toBe(200);
    expect(res.body[0].email).toBe(user.email);
  });
});
