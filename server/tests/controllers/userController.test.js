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

const createAppWithAuth = (user) => {
  const app = express();
  app.use(express.json());
  app.use((req, res, next) => {
    req.user = user;
    next();
  });

  app.get("/users", userController.getAllUsers);
  app.put("/users/:userId", userController.updateUser);
  app.delete("/users/:userId", userController.deleteUser);
  app.get("/users/export", userController.exportToExcel);
  app.get("/users/search", userController.searchUser);
  app.get("/users/:userId", userController.getUser);
  app.get("/users/admin-search/:searchKey", userController.searchUserAdmin);

  return app;
};

let currentUserId;
let app;

beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await clearDatabase();
  currentUserId = null;
});

afterAll(async () => await closeDatabase());

describe("UserController Integration", () => {
  beforeEach(() => {
    app = createAppWithAuth({ id: currentUserId, isAdmin: true });
  });

  test("#TC001 - get all users", async () => {
    await createUser();
    const res = await request(app).get("/users");
    expect(res.status).toBe(200);
    expect(res.body.users.length).toBe(1);
  });

  test("#TC002 - get a user by ID", async () => {
    const user = await createUser();
    const res = await request(app).get(`/users/${user._id}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe(user.email);
  });

  test("#TC003 - update user info", async () => {
    const user = await createUser();
    currentUserId = user._id.toString();
    app = createAppWithAuth({ id: currentUserId, isAdmin: true });

    const res = await request(app)
      .put(`/users/${user._id}`)
      .send({ username: "BobUpdated" });

    expect(res.status).toBe(200);
    expect(res.body.username).toBe("BobUpdated");
  });

  test("#TC004 - delete user", async () => {
    const user = await createUser();
    currentUserId = user._id.toString();
    app = createAppWithAuth({ id: currentUserId, isAdmin: true });

    const res = await request(app).delete(`/users/${user._id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User deleted successfully");
  });

  test("#TC006 -  search users by username/email", async () => {
    const user = await createUser({ username: "SearchMe" });
    const res = await request(app).get("/users/search?search=SearchMe");
    expect(res.status).toBe(200);
    expect(res.body[0].username).toBe("SearchMe");
  });

  test("#TC007 - allow admin to search by ID or name", async () => {
    const user = await createUser({ username: "AdminSearch" });
    const res = await request(app).get(`/users/admin-search/${user._id}`);
    expect(res.status).toBe(200);
    expect(res.body[0].email).toBe(user.email);
  });

  test("#TC008 - get all users - not admin", async () => {
    const appNonAdmin = createAppWithAuth({ id: "nonadmin", isAdmin: false });
    const res = await request(appNonAdmin).get("/users");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("You dont have permission to do this action");
  });

  test("#TC009 - get user by ID - not found", async () => {
    const res = await request(app).get(
      `/users/${new mongoose.Types.ObjectId()}`
    );
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("User not found");
  });

  test("#TC010 - update user - unauthorized", async () => {
    const user = await createUser();
    const appWrongUser = createAppWithAuth({
      id: new mongoose.Types.ObjectId().toString(),
      isAdmin: true,
    });

    const res = await request(appWrongUser)
      .put(`/users/${user._id}`)
      .send({ username: "ShouldFail" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe(
      "You don't have permission to do this action"
    );
  });

  test("#TC011 - update user - password too short", async () => {
    const user = await createUser();
    currentUserId = user._id.toString();
    app = createAppWithAuth({ id: currentUserId, isAdmin: true });

    const res = await request(app)
      .put(`/users/${user._id}`)
      .send({ password: "123" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(
      "Password must be at least 6 characters long"
    );
  });

  test("#TC012 - delete user - unauthorized", async () => {
    const user = await createUser();
    const appWrongUser = createAppWithAuth({
      id: new mongoose.Types.ObjectId().toString(),
      isAdmin: true,
    });

    const res = await request(appWrongUser).delete(`/users/${user._id}`);
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("You dont have permission to do this action");
  });

  test("#TC013 - export users - not admin", async () => {
    const appNonAdmin = createAppWithAuth({ id: "nonadmin", isAdmin: false });
    const res = await request(appNonAdmin).get("/users/export");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("You are not allowed to export users");
  });

  test("#TC014 - search user - no match", async () => {
    const user = await createUser({ username: "RealUser" });
    currentUserId = user._id.toString();
    app = createAppWithAuth({ id: currentUserId, isAdmin: true });

    const res = await request(app).get("/users/search?search=NoMatchFound");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User not found");
  });

  test("#TC015 - admin search - not admin", async () => {
    const appNonAdmin = createAppWithAuth({ id: "nonadmin", isAdmin: false });
    const res = await request(appNonAdmin).get("/users/admin-search/abc");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("You are not allowed to search users");
  });

  test("#TC016 - admin search - no result", async () => {
    const res = await request(app).get("/users/admin-search/nomatchuser");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User not found");
  });
  test("#TC017 - update profile with name exceeding maximum length", async () => {
    const user = await createUser();
    app = createAppWithAuth({ id: user._id.toString(), isAdmin: false });

    const longName = "A".repeat(101); // Assuming max is 100 chars

    const res = await request(app)
      .put(`/users/${user._id}`)
      .send({ username: longName });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/username.*too long/i);
  });

  test("#TC018 - update profile with name less than minimum length", async () => {
    const user = await createUser();
    app = createAppWithAuth({ id: user._id.toString(), isAdmin: false });

    const res = await request(app)
      .put(`/users/${user._id}`)
      .send({ username: "A" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/username.*too short/i);
  });

  test("#TC019 - update profile with invalid phone number format", async () => {
    const user = await createUser();
    app = createAppWithAuth({ id: user._id.toString(), isAdmin: false });

    const res = await request(app)
      .put(`/users/${user._id}`)
      .send({ phoneNumber: "abc123" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalid phone number/i);
  });

  test("#TC020 - update profile with special characters in name", async () => {
    const user = await createUser();
    app = createAppWithAuth({ id: user._id.toString(), isAdmin: false });

    const res = await request(app)
      .put(`/users/${user._id}`)
      .send({ username: "@@@!!!" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/username.*invalid characters/i);
  });

  test("#TC021 - update profile with only spaces in name", async () => {
    const user = await createUser();
    app = createAppWithAuth({ id: user._id.toString(), isAdmin: false });

    const res = await request(app)
      .put(`/users/${user._id}`)
      .send({ username: "     " });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/username.*cannot be empty/i);
  });

  test("#TC022 - update profile without changing any information", async () => {
    const user = await createUser({ username: "SameUser" });
    app = createAppWithAuth({ id: user._id.toString(), isAdmin: false });

    const res = await request(app)
      .put(`/users/${user._id}`)
      .send({ username: "SameUser" });

    expect(res.status).toBe(400);
    expect(res.body.username).toBe("SameUser");
  });
});
