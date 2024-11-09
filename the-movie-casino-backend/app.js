// Backend: Express, Mongoose, and Socket.IO

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIo = require('socket.io');
const http = require('http');
const Room = require('./models/Room');
const Message = require('./models/Message');

const DB_URI = require('../db').DB_URI
// Initialize Express and HTTP server
const app = express();
const server = http.createServer(app);

// Set up Socket.IO
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',  // Allow the frontend to connect
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// Utility function to generate room code
function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Create a new room
app.post('/create-room', async (req, res) => {
  const { host } = req.body;
  const roomCode = generateRoomCode();
  
  const room = new Room({
    roomCode,
    host,
    members: [host],
    messages: [],
  });

  try {
    await room.save();
    res.status(201).json({ roomCode, host });
  } catch (error) {
    res.status(500).json({ error: 'Error creating room' });
  }
});

// Join a room
app.post('/join-room', async (req, res) => {
  const { roomCode, user } = req.body;

  try {
    const room = await Room.findOne({ roomCode });
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    room.members.push(user);
    await room.save();

    res.status(200).json({ roomCode, members: room.members });
  } catch (error) {
    res.status(500).json({ error: 'Error joining room' });
  }
});

// Send a message (this will be handled by Socket.IO)
io.on('connection', (socket) => {
  socket.on('join_room', async ({ roomCode, user }) => {
    socket.join(roomCode); // Join the room

    // Get initial messages
    const room = await Room.findOne({ roomCode });
    if (room) {
      socket.emit('load_messages', room.messages); // Send existing messages
    }
  });

  socket.on('send_message', async ({ roomCode, user, message }) => {
    const room = await Room.findOne({ roomCode });

    if (room) {
      // Save message to DB
      const newMessage = new Message({ roomCode, user, message });
      await newMessage.save();

      // Add message to room's message array
      console.log(message)
      room.messages.push({ user, message });
      await room.save();

      // Broadcast the message to all users in the room
      io.to(roomCode).emit('receive_message', { user, message });
    }
  });

  socket.on('disconnect', (room) => {
    const newMessage = new Message({roomCode, user, message: "disconnected"})
    room.messages.push({user, newMessage})
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
