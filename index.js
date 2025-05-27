const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const chatSocket = require("./sockets/chatSocket");
const uploadRoutes = require("./routes/uploadRoutes");

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/upload", uploadRoutes);

chatSocket(io);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    server.listen(4000, () => console.log("Server running on port 4000"))
  )
  .catch((err) => console.error("MongoDB connection error:", err));
