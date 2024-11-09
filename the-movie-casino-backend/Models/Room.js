const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomCode: { type: String, required: true, unique: true },
  host: { type: String, required: true },
  members: [{ type: String }],
  messages: [{
    user: { type: String },
    message: { type: String },
    timestamp: { type: Date, default: Date.now },
  }],
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
