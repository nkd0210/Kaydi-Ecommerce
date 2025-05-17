/**
 * @jest-environment node
 */
const request = require("supertest");
const express = require("express");
const {
  connect,
  clearDatabase,
  closeDatabase,
} = require("../setup/mongoMemoryServer");

const messageController = require("../../controllers/messageController");
const { createUser } = require("../helpers/userHelper");
const { createChat } = require("../helpers/chatHelper");
const { createMessage } = require("../helpers/messageHelper");

// Mock Pusher
jest.mock("../../src/lib/pusher", () => ({
  pusherServer: {
    trigger: jest.fn().mockResolvedValue(true),
  },
}));

const app = express();
app.use(express.json());

// Fake auth middleware
let currentUser;
app.use(async (req, res, next) => {
  if (!currentUser) {
    currentUser = await createUser({ email: "sender@example.com" });
  }
  req.user = { id: currentUser._id.toString() };
  next();
});

// Bind routes
app.get("/message/:chatId", messageController.getAllMessages);
app.post("/message", messageController.sendMessage);

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

describe("Message Controller - Happy Path", () => {
  test("#TC001 - get all messages of a chat", async () => {
    const chat = await createChat({ members: [currentUser._id] });

    await createMessage({
      content: "Hi",
      sender: currentUser._id,
      chat: chat._id,
    });

    const res = await request(app).get(`/message/${chat._id}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].content).toBe("Hi");
  });

  test("#TC002 - send message to a chat", async () => {
    const chat = await createChat({ members: [currentUser._id] });

    const res = await request(app).post("/message").send({
      chatId: chat._id.toString(),
      content: "New message here",
    });

    expect(res.status).toBe(200);
    expect(res.body.latestMessage.content).toBe("New message here");
    expect(
      res.body.messages.some((m) => m.content === "New message here")
    ).toBe(true);
  });
});
