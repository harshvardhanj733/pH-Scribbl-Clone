"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket;

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // connect only once
    if (!socket) {
      socket = io("http://localhost:4000", {
        transports: ["websocket"],
      });
    }

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("✅ Connected to socket server");
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("❌ Disconnected from socket server");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return { socket, isConnected };
};
