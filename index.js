const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const Message = require("./models/Message");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

mongoose.connect(
  "mongodb+srv://jsnikhil00:3hdDY60VYnYadR6T@cluster0.jdmfip1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);

app.use(cors());
app.use(express.json());
app.use("/api/chat", require("./routes/chatRoutes"));

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (room) => {
    socket.join(room);
  });

  socket.on("sendMessage", async ({ room, message, user }) => {
    const msg = new Message({ room, message, user });
    await msg.save();
    io.to(room).emit("receiveMessage", { message, user });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    server.listen(4000, () => console.log("Server running on port 4000"))
  )
  .catch((err) => console.error("MongoDB connection error:", err));
