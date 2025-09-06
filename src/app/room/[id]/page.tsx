"use client";

import { useParams } from "next/navigation";
import { getUserWithExpiry } from "@/lib/getUserWithExpiry";
import { useRouter } from "next/navigation";
import Chat from "@/components/game/ChatBox";
import VideoCall from "@/components/game/VideoGrid";

export default function RoomPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const user = getUserWithExpiry(router);

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Room ID: {id}</h1>
      <div className="grid grid-cols-2 gap-4">
        <VideoCall id={id} user={user} />
        <Chat id={id} user={user} />
      </div>
    </>
  );
}
