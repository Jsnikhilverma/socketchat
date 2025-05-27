const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  sender: String,
  room: String,
  content: String,
  type: { type: String, default: "text" },
  seenBy: [String],
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", MessageSchema);
