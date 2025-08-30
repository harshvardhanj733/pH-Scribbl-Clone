"use client";

import { useParams } from "next/navigation";
import { getUserWithExpiry } from "@/lib/getUserWithExpiry";
import { useRouter } from "next/navigation";
import Chat from "@/components/game/ChatBox";

export default function RoomPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const user = getUserWithExpiry(router);

  return (
    <>
      <Chat id={id} user={user} />
    </>
  );
}
