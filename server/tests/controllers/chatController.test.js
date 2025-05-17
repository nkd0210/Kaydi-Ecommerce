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

const chatController = require("../../controllers/chatController");

const { createUser } = require("../helpers/userHelper");
const { createChat } = require("../helpers/chatHelper");

const app = express();
app.use(express.json());

// Fake auth middleware
let mockUserId = null;
app.use(async (req, res, next) => {
  if (!mockUserId) {
    const user = await createUser();
    mockUserId = user._id.toString();
  }
  req.user = { id: mockUserId };
  next();
});

// Bind routes
app.post("/chat/single", chatController.accessSingleChat);
app.get("/chat/group/:groupChatId", chatController.accessGroupChat);
app.get("/chat", chatController.getAllChatsOfUser);
app.post("/chat/group", chatController.createGroupChat);
app.put("/chat/group/:groupChatId", chatController.updateGroupChat);
app.put("/chat/group/remove/:groupChatId", chatController.removeFromGroupChat);
app.put("/chat/group/add/:groupChatId", chatController.addToGroupChat);

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

describe("Chat Controller - Happy Path", () => {
  test("#TC001 - access single chat (new)", async () => {
    const receiver = await createUser({
      email: "receiver@example.com",
      username: "receiver",
    });

    const res = await request(app).post("/chat/single").send({
      receiverId: receiver._id.toString(),
    });

    expect(res.status).toBe(200);
    expect(res.body.chat).toBeDefined();
    expect(res.body.receiver._id).toBe(receiver._id.toString());
  });

  test("#TC002 - create and access group chat", async () => {
    const user1 = await createUser({ email: "a@a.com", username: "a" });
    const user2 = await createUser({ email: "b@b.com", username: "b" });

    const res = await request(app)
      .post("/chat/group")
      .send({
        memberIds: [user1._id.toString(), user2._id.toString()],
        chatName: "Test Group",
      });

    expect(res.status).toBe(200);
    expect(res.body.chatName).toBe("Test Group");
    expect(res.body.isGroupChat).toBe(true);
  });

  test("#TC003 - get all chats of user", async () => {
    const receiver = await createUser({ username: "receiver2" });

    await request(app).post("/chat/single").send({
      receiverId: receiver._id.toString(),
    });

    const res = await request(app).get("/chat");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("#TC004 - update group chat", async () => {
    const chat = await createChat({
      isGroupChat: true,
      chatName: "Old Name",
      members: [mockUserId],
      groupAdmin: mockUserId,
    });

    const res = await request(app).put(`/chat/group/${chat._id}`).send({
      chatName: "New Name",
      groupPhoto: "new.jpg",
    });

    expect(res.status).toBe(200);
    expect(res.body.chatName).toBe("New Name");
  });

  test("#TC005 - createGroupChat", async () => {
    const newUser = await createUser({
      email: "join@me.com",
      username: "joinme",
    });
    const chat = await createChat({
      isGroupChat: true,
      chatName: "Group Add",
      members: [mockUserId],
      groupAdmin: mockUserId,
    });

    const res = await request(app).put(`/chat/group/add/${chat._id}`).send({
      userId: newUser._id.toString(),
    });

    expect(res.status).toBe(200);
    expect(res.body.members.map((m) => m._id.toString())).toEqual(
      expect.arrayContaining([newUser._id.toString()])
    );
  });

  test("#TC006 - remove member from group chat", async () => {
    const toRemove = await createUser({
      email: "bye@me.com",
      username: "removeMe",
    });
    const chat = await createChat({
      isGroupChat: true,
      chatName: "Group Remove",
      members: [mockUserId, toRemove._id],
      groupAdmin: mockUserId,
    });

    const res = await request(app)
      .put(`/chat/group/remove/${chat._id}`)
      .send({ userDeletedId: toRemove._id.toString() });

    expect(res.status).toBe(200);
    const remaining = res.body.members.map((m) => m._id.toString());
    expect(remaining).not.toContain(toRemove._id.toString());
  });

  test("#TC007 - access group chat", async () => {
    const chat = await createChat({
      isGroupChat: true,
      members: [mockUserId],
      groupAdmin: mockUserId,
    });

    const res = await request(app).get(`/chat/group/${chat._id}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(chat._id.toString());
  });
});
