// index.ts

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import User from "../src/types/User.js";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*", // later restrict to your Next.js domain
  },
});

io.on("connection", (socket) => {
  console.log("🟢 A user connected:", socket.id);
  let currRoom:string = "";
  let currUser:User = { id: "", username: "", isHost: false };
  // Handle joining a room
  socket.on("join_room", ({ roomId, user }) => {
    console.log(`📥 User ${user.id} joined room ${roomId}`);
    socket.join(roomId);

    // Notify others in the room
    socket.to(roomId).emit("user_joined", user);
    currUser = user;
    currRoom = roomId;
  });

  // Handle leaving a room
  socket.on("leave_room", ({ roomId, user }) => {
    console.log(`📤 User ${user.id} left room ${roomId}`);
    socket.leave(roomId);
    socket.to(roomId).emit("user_left", { username: user.username });
  });

  // Handle messages
  socket.on("send_message", ({ roomId, message, user }) => {
    console.log(`💬 ${user.id} in ${roomId}: ${message}`);
    io.to(roomId).emit("receive_message", { userSendingMessage: user, message });
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("🔴 A user disconnected:", socket.id);
    io.to(currRoom).emit("user_left", { username: currUser.username });
  });
});

const PORT = 4001;
httpServer.listen(PORT, () => {
  console.log(`🎨 Socket.IO server running on http://localhost:${PORT}`);
});
