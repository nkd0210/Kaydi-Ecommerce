/**
 * @jest-environment node
 */
const request = require("supertest");
const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

process.env.JWT_SECRET = "kaydi";
process.env.JWT_REFRESH_SECRET = "kaydi0210";

const {
  connect,
  closeDatabase,
  clearDatabase,
} = require("../setup/mongoMemoryServer");

const User = require("../../models/userModel").default;
const { createUser } = require("../helpers/userHelper"); // ✅ Import helper
const authController = require("../../controllers/authController");

const app = express();
app.use(express.json());
app.use(cookieParser());

// Bind routes
app.post("/auth/signup", authController.signUp);
app.post("/auth/signin", authController.signIn);
app.post("/auth/signout", authController.signOut);
app.post("/auth/refresh", authController.refreshToken);

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

describe("Auth Controller - Happy Path", () => {
  test("#TC001 - sign up with valid credentials", async () => {
    const res = await request(app).post("/auth/signup").send({
      username: "testuser",
      email: "test@example.com",
      password: "TestPass123",
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User registered successfully");

    const userInDb = await User.findOne({ email: "test@example.com" });
    expect(userInDb).not.toBeNull();
    expect(userInDb.username).toBe("testuser");
  });

  test("#TC002 - sign in with correct credentials", async () => {
    const hashed = bcrypt.hashSync("TestPass123", 10);

    await createUser({
      username: "testuser",
      email: "test@example.com",
      password: hashed,
    }); // ✅ Use helper

    const res = await request(app).post("/auth/signin").send({
      email: "test@example.com",
      password: "TestPass123",
    });

    // Debug print
    if (res.status !== 200) {
      console.error("❌ Response body:", res.body);
    }

    expect(res.status).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();
    expect(res.body.username).toBe("testuser");
  });

  test("#TC003 - sign out user", async () => {
    const res = await request(app).post("/auth/signout");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User signed out successfully");
  });

  test("#TC004 - refresh token should return new access token", async () => {
    const fakeUser = {
      id: "123abc",
      username: "testuser",
      isAdmin: false,
    };

    const refreshToken = jwt.sign(fakeUser, "refresh_secret", {
      expiresIn: "1d",
    });

    process.env.JWT_SECRET = "access_secret";
    process.env.JWT_REFRESH_SECRET = "refresh_secret";

    const res = await request(app)
      .post("/auth/refresh")
      .set("Cookie", [`refresh_token=${refreshToken}`]);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Token refreshed successfully");
    expect(res.headers["set-cookie"]).toBeDefined();
  });
});
