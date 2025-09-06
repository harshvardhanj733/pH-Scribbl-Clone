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

const userIdToSocketIdMap: Map<string, string> = new Map();
const socketIdToUserIdMap: Map<string, string> = new Map();
const userIdToUserMap: Map<string, User> = new Map();

io.on("connection", (socket) => {
  console.log("🟢 A user connected:", socket.id);
  let currRoom:string = "";
  let currUser:User = { id: "", username: "", isHost: false };
  
  // Handle joining a room
  socket.on("join_room", ({ roomId, user }) => {
    userIdToSocketIdMap.set(user.id, socket.id);
    socketIdToUserIdMap.set(socket.id, user.id);
    userIdToUserMap.set(user.id, user);
    console.log(`📥 User ${user.id} joined room ${roomId}`);
    socket.join(roomId);

    // Notify others in the room
    socket.to(roomId).emit("user_joined", user);
    currUser = user;
    currRoom = roomId;
  });

  //Handle Sending Offer
  socket.on("send_offer", ({ offer, toUserId }) => {
    const toSocketId = userIdToSocketIdMap.get(toUserId);
    const fromUserId = socketIdToUserIdMap.get(socket.id);
    const toUsername = userIdToUserMap.get(toUserId).username;
    const fromUsername = userIdToUserMap.get(fromUserId).username;
    if (toSocketId) {
      socket.to(toSocketId).emit("receive_offer", { offer, fromUserId, fromSocketId: socket.id });
      console.log("From Socket ID: ");
      console.log(socket.id);
      console.log(`📨 Offer sent from ${fromUsername} to ${toUsername}`);
    } else {
      console.log(`❌ User ${toUsername} not found for offer`);
    }   
  });

  //Handle Receiving Answer
  socket.on("offer_accepted", ({ answer, toUserId }) => {
    const toSocketId = userIdToSocketIdMap.get(toUserId); 
    const fromUserId = socketIdToUserIdMap.get(socket.id);
    const toUsername = userIdToUserMap.get(toUserId).username;
    const fromUsername = userIdToUserMap.get(fromUserId).username;
    if (toSocketId) {
      socket.to(toSocketId).emit("receive_answer", { answer, fromUserId });   
      console.log(`📨 Answer sent from ${fromUsername} to ${toUsername}`)
    } else {
        console.log(`❌ User ${toUsername} not found for answer`)
    };
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

  //WebRTC Signaling Events ---
  // socket.on("webrtc_offer", ({ to, from, offer }) => {
  //   io.to(to).emit("webrtc_offer", { from, offer });
  // });

  // socket.on("webrtc_answer", ({ to, from, answer }) => {
  //   io.to(to).emit("webrtc_answer", { from, answer });
  // });

  // socket.on("webrtc_ice_candidate", ({ to, from, candidate }) => {
  //   io.to(to).emit("webrtc_ice_candidate", { from, candidate });
  // });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("🔴 A user disconnected:", socket.id);
    io.to(currRoom).emit("user_left", { username: currUser.username });
  });
});

const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(`🎨 Socket.IO server running on http://localhost:${PORT}`);
});
