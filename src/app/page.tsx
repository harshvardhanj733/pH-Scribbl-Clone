"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import setUserWithExpiry from "@/lib/setUserWithExpiry";

export default function HomePage() {
  const [username, setUsername] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const router = useRouter();

  const handleCreateRoom = () => {
    if (!username) return alert("Please enter your name");
    const newRoomId = uuidv4(); // generate unique room ID
    // localStorage.setItem(
    //   "user",
    //   JSON.stringify({
    //     userId: uuidv4(),
    //     username,
    //     isHost: true,
    //   })
    // );
    setUserWithExpiry({id: uuidv4(), username, isHost: true});
    router.push(`/room/${newRoomId}`);
  };

  const handleJoinRoom = () => {
    if (!username) return alert("Please enter your name");
    if (!roomCode) return alert("Please enter a room code");
    // localStorage.setItem(
    //   "user",
    //   JSON.stringify({
    //     userId: uuidv4(),
    //     username,
    //     isHost: false,
    //   })
    // );
    setUserWithExpiry({id: uuidv4(), username, isHost: false});
    router.push(`/room/${roomCode}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">🎨 Welcome to Scribbl.io Clone</h1>

      <input
        type="text"
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border rounded px-4 py-2 mb-4 w-64"
      />

      <button
        onClick={handleCreateRoom}
        className="bg-blue-500 text-white px-6 py-2 rounded mb-4"
      >
        Create Room
      </button>

      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Enter Room Code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          className="border rounded px-4 py-2 w-48"
        />
        <button
          onClick={handleJoinRoom}
          className="bg-green-500 text-white px-6 py-2 rounded"
        >
          Join Room
        </button>
      </div>
    </div>
  );
}
