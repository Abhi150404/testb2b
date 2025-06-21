// File: controllers/chatController.js
const Chat = require('../models/chat');

// POST: Save a new message
exports.sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;

    if (!senderId || !receiverId || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const chat = await Chat.create({ senderId, receiverId, message });
    res.status(201).json({ success: true, data: chat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET: Get all chats for a specific user
exports.getUserChats = async (req, res) => {
  try {
    const { userId } = req.params;
    const chats = await Chat.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    }).sort({ timestamp: 1 });

    res.json({ success: true, data: chats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET: Admin fetches all messages
exports.getAllChatsForAdmin = async (req, res) => {
  try {
const chats = await Chat.find({}).sort({ timestamp: -1 });

    res.json({ success: true, data: chats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST: Admin reply to user (optional route)
exports.adminReply = async (req, res) => {
  try {
    const { adminId, userId, message } = req.body;

    if (!adminId || !userId || !message) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const chat = await Chat.create({
      senderId: adminId,
      receiverId: userId,
      message,
    });

    res.status(201).json({ success: true, data: chat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
