"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import { useRouter } from "next/navigation";
import User from "@/types/User";

export default function Chat({id, user}:{id:string, user:User}) {
  // const { id } = useParams<{ id: string }>();
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const router = useRouter();
  // const user = getUserWithExpiry(router);

  useEffect(() => {
    if (!socket) return;

    // Join the room
    socket.emit("join_room", { roomId: id, user });

    //Listen for user joined
    socket.on("user_joined", (user) => {
      setMessages((prev) => [...prev, `User ${user.username} joined the room.`]);
    });

    // Listen for incoming messages
    socket.on("receive_message", ({userSendingMessage, message}) => {
      console.log("User Sending Message: " + userSendingMessage);
      console.log("User: " + user);
      if(user.id !== userSendingMessage.id){
        message = `${userSendingMessage.username}: ${message}`;
      }
      else{
        message = `You: ${message}`;
      }
      setMessages((prev) => [...prev, message]);
    });

    socket.on("user_left", ({ username }) => {
      setMessages((prev) => [...prev, `User ${username} left the room.`]);
    });

    return () => {
      socket.off("receive_message");
      socket.emit("leave_room", {roomId: id, user}); // optional if you handle leaving on backend
    };
  }, [socket, id]);

  const sendMessage = () => {
    if (input.trim() === "") return;
    socket.emit("send_message", { roomId: id, message: input, user });
    setInput("");
  };

  return (
    <div className="p-6">
      <p className="mb-2">
        Status:{" "}
        <span className={isConnected ? "text-green-600" : "text-red-600"}>
          {isConnected ? "Connected ✅" : "Disconnected ❌"}
        </span>
      </p>

      <div className="border rounded-lg p-4 h-64 overflow-y-auto mb-4 bg-gray-50">
        {messages.length === 0 && (
          <p className="text-gray-500">No messages yet...</p>
        )}
        {messages.map((msg, i) => (
          <p key={i} className="text-sm mb-1">
            {msg}
          </p>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
