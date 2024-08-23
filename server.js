import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";
import express from "express";
import { Server } from "socket.io";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 9000;

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// Serve static files from the 'public' directory
app.use(express.static(__dirname + "/public"));

// Serve the index.html file from the 'public' directory
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html"); // Corrected file path
});

// Socket.io setup
const io = new Server(server);
const users = {};

// If any new user joins, let other users connected to the server know
io.on("connection", (socket) => {
  socket.on("new-user-joined", (Name) => {
    users[socket.id] = Name;
    socket.broadcast.emit("user-joined", Name);
  });

  // If someone sends a message, broadcast it to other people
  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      Name: users[socket.id],
    });
  });

  // If someone leaves the chat, let others know
  socket.on("disconnect", () => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});
