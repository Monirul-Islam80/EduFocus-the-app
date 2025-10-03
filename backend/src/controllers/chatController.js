const prisma = require("../config/db");

exports.allUsers = async (req, res) => {
  const searchTerm = req.query.search || "";
  console.log("Search term:", searchTerm);

  try {
    const users = await prisma.user.findMany({
      where: {
        email: {
          contains: searchTerm,
          mode: "insensitive",
        },
        id: {
          not: req.user.id,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    console.log("Found users:", users);

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};
exports.fetchChatList = async (req, res) => {
  try {
    const chats = await prisma.chatModel.findMany({
      where: {
        users: { some: { userId: req.user.id } },
      },
      include: {
        users: { include: { user: true } },
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
    const chatList = chats.map((chat) => ({
      id: chat.id,
      name: chat.chatName,
      avatar: chat.avatar,
      isGroupChat: chat.isGroupChat,
      time: chat.messages.length > 0 ? chat.messages[0].createdAt : null,
      message:
        chat.messages.length > 0 ? chat.messages[0].content : "No messages yet",
      users: chat.users.map((u) => ({
        id: u.user.id,
        name: u.user.name,
        email: u.user.email,
        avatar: u.user.avatar,
      })),
    }));
    res.json(chatList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch chat list" });
  }
};
exports.accessChat = async (req, res) => {
  const { userId } = req.body;
  console.log(userId);

  if (!userId) return res.status(400).json({ error: "UserId param not sent" });

  try {
    let chat = await prisma.chatModel.findFirst({
      where: {
        isGroupChat: false,
        AND: [
          { users: { some: { userId: req.user.id } } },
          { users: { some: { userId } } },
        ],
      },
      include: {
        users: { include: { user: true } },
        messages: true,
      },
    });

    if (chat) return res.json(chat);

    const newChat = await prisma.chatModel.create({
      data: {
        chatName: "Direct Chat",
        isGroupChat: false,
        users: {
          create: [{ userId: req.user.id }, { userId }],
        },
      },
      include: {
        users: { include: { user: true } },
      },
    });

    res.json(newChat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to access chat" });
  }
};

exports.fetchChats = async (req, res) => {
  try {
    const chats = await prisma.chatModel.findMany({
      where: {
        users: { some: { userId: req.user.id } },
      },
      include: {
        users: { include: { user: true } },
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
};

exports.createGroup = async (req, res) => {
  const { users, name } = req.body;

  if (!name) return res.status(400).json({ error: "Missing data" });

  try {
    const groupChat = await prisma.chatModel.create({
      data: {
        chatName: name,
        isGroupChat: true,
        users: {
          create: [
            { userId: req.user.id, role: "admin" },
            ...users?.map((id) => ({ userId: id })),
          ],
        },
      },
      include: {
        users: { include: { user: true } },
      },
    });

    res.status(201).json(groupChat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create group" });
  }
};

exports.renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  try {
    const updated = await prisma.chatModel.update({
      where: { id: chatId },
      data: { chatName },
      include: { users: { include: { user: true } } },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to rename group" });
  }
};
exports.addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    await prisma.chatUser.create({
      data: { chatId, userId },
    });

    const updated = await prisma.chatModel.findUnique({
      where: { id: chatId },
      include: { users: { include: { user: true } } },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add user" });
  }
};

exports.removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    await prisma.chatUser.deleteMany({
      where: { chatId, userId },
    });

    const updated = await prisma.chatModel.findUnique({
      where: { id: chatId },
      include: { users: { include: { user: true } } },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove user" });
  }
};
