// File: socketServer.js
const { Server } = require('socket.io');
const Chat = require('./models/chat');

function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('🔌 User connected:', socket.id);

    // Join a user-specific room
    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`📦 User ${userId} joined room`);
    });

    // Handle sending messages
    socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
      if (!senderId || !receiverId || !message) return;

      try {
        const chat = await Chat.create({ senderId, receiverId, message });

        // Send to receiver in their room
        io.to(receiverId).emit('receiveMessage', chat);
      } catch (err) {
        console.error('❌ Message save failed:', err.message);
      }
    });

    socket.on('disconnect', () => {
      console.log('❎ User disconnected:', socket.id);
    });
  });
}

module.exports = initSocket;
