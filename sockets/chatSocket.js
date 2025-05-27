const User = require("../models/User");
const Message = require("../models/Message");

const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_room", async ({ room, username }) => {
      socket.join(room);
      await User.findOneAndUpdate(
        { username },
        { username, online: true },
        { upsert: true }
      );
      const messages = await Message.find({ room }).sort({ timestamp: 1 });
      socket.emit("chat_history", messages);
      socket.to(room).emit("user_joined", username);
    });

    socket.on("send_message", async (data) => {
      const message = new Message(data);
      await message.save();
      io.to(data.room).emit("receive_message", message);
    });

    socket.on("typing", ({ room, username }) => {
      socket.to(room).emit("typing", username);
    });

    socket.on("message_seen", async ({ room, messageId, username }) => {
      const msg = await Message.findById(messageId);
      if (msg && !msg.seenBy.includes(username)) {
        msg.seenBy.push(username);
        await msg.save();
        io.to(room).emit("message_seen", { messageId, username });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = chatSocket;
