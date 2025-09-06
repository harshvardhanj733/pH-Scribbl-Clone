"use client";

// import React, { useEffect, useRef } from "react";
// import { useWebRTC } from "@/hooks/useWebRTC";

// interface Props {
//   roomId: string;
//   userId: string;
// }

import React, { useEffect, useCallback, useRef } from "react";
import { useSocket } from "@/hooks/useSocket";
import { useWebRTC } from "@/hooks/useWebRTC";
import User from "@/types/User";

export default function VideoCall({id, user}:{id:string, user:User}) {
  // const { peers, localStream } = useWebRTC(roomId, userId);
  // const localVideoRef = useRef<HTMLVideoElement>(null);

  
  // useEffect(() => {
    //   if (localVideoRef.current && localStream) {
      //     localVideoRef.current.srcObject = localStream;
      //   }
      // }, [localStream]);
      
  const { socket, isConnected } = useSocket();
  const { peers, createOffer, createAnswer, setRemoteAnswer, sendStream } = useWebRTC();

  // const [myStream, setMyStream] = React.useState<MediaStream | null>(null);
  const myStreamRef = useRef<HTMLVideoElement | null>(null);

  const handleSendOffer = useCallback(async (userJoining:User) => {
    const offer = await createOffer(userJoining.id);
    socket.emit("send_offer", { offer, toUserId: userJoining.id });
  }, [socket, createOffer]);

  const handleReceiveOffer = useCallback(async (data: any) => {
    const { offer, fromUserId, fromSocketId } = data;
    const answer = await createAnswer(fromUserId, offer);
    // console.log("From Offer: ");
    // console.log(offer);
    // console.log("From Username: ");
    // console.log(fromUsername);
    // console.log("From Socket ID: ");
    // console.log(fromSocketId);
    // console.log(typeof fromSocketId);
    if (fromSocketId) {
      socket.emit("offer_accepted", { answer, toUserId: fromUserId });
      // console.log(`📨 Answer sent from ${user.username} to ${fromUsername}`);
    }
    else {
      console.log(`❌ User ${fromUserId} not found for answer`);
    }
  }, [createAnswer, socket]);

  const handleReceiveAnswer = useCallback(async (data: any) => {
    const { answer, fromUserId } = data;
    await setRemoteAnswer(fromUserId, answer);
  }, [setRemoteAnswer]);
  
  useEffect(() => {
    if (!socket) return;

    socket.on("user_joined", handleSendOffer);

    socket.on("receive_offer", handleReceiveOffer);

    socket.on("receive_answer", handleReceiveAnswer);

    return () => {
      socket.off("user_joined", handleSendOffer);
      socket.off("receive_offer", handleReceiveOffer);
      socket.off("receive_answer", handleReceiveAnswer);
    };

  }, [socket, id]);

  // const videoRef = useRef<HTMLVideoElement>(null);

  const getUserMediaStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    // setMyStream(stream);
    if(myStreamRef.current !== null){
      myStreamRef.current.srcObject = stream;
    }
    sendStream(stream);
  }, [sendStream]);

  useEffect(() => {
    getUserMediaStream();
  }, [getUserMediaStream])

  return (
    <div>
      <video ref={myStreamRef} autoPlay playsInline muted className="rounded-lg shadow-lg w-full h-auto" />
    </div>
  );
}
