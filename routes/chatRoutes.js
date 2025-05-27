const express = require("express");
const router = express.Router();
const Room = require("../models/Room");
const Message = require("../models/Message");

// Create room
router.post("/create-room", async (req, res) => {
  const { code } = req.body;
  try {
    const existing = await Room.findOne({ code });
    if (existing) return res.status(400).json({ error: "Room already exists" });

    const room = await Room.create({ code });
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get room details
router.get("/room/:code", async (req, res) => {
  try {
    const room = await Room.findOne({ code: req.params.code });
    if (!room) return res.status(404).json({ error: "Room not found" });
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get messages for room
router.get("/room/:code/messages", async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.code }).sort(
      "createdAt"
    );
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
