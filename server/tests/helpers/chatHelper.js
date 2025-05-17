const Chat = require("../../models/chatModel").default;

async function createChat(overrides = {}) {
  const defaultData = {
    members: [],
    isGroupChat: false,
    messages: [],
  };
  return await Chat.create({ ...defaultData, ...overrides });
}

module.exports = { createChat };
