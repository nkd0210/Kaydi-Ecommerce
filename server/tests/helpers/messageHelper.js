const Message = require("../../models/messageModel").default;

async function createMessage(overrides = {}) {
  const defaultData = {
    content: "Hello world",
    sender: null,
    chat: null,
    seenBy: [],
  };
  return await Message.create({ ...defaultData, ...overrides });
}

module.exports = { createMessage };
