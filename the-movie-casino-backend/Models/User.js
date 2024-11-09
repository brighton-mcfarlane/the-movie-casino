const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  chips: { type: Number, default: 100 }  // Starting chips
});

module.exports = mongoose.model('User', userSchema);
