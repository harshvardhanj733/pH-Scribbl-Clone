"use client";

import User from "@/types/User";
import { useEffect, useMemo } from "react";

export const useWebRTC = () => {
  const peers = useMemo(() => new Map<string, RTCPeerConnection>(), []);
  // const peer = useMemo(() => new RTCPeerConnection(), []);
  // const peer = useRef(new RTCPeerConnection()).current;

  const getPeer = (userIdToConnect: string) => {
    if(!peers.has(userIdToConnect)){
      const newPeer = new RTCPeerConnection();
      peers.set(userIdToConnect, newPeer);
      return newPeer;
    } 
    return peers.get(userIdToConnect)!;
  }

  const createOffer = async (userIdToConnect: string) => {
    const peer = getPeer(userIdToConnect);
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    console.log("Created Offer");
    return offer;
  }

  const createAnswer = async (userIdToConnect: string, offer:RTCSessionDescriptionInit) => {
    console.log("Received Offer: ");
    console.log(offer);
    console.log(offer.type);
    const peer = getPeer(userIdToConnect);
    await peer.setRemoteDescription(offer);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    console.log("Created Answer: ");
    console.log(answer);
    return answer;
  }

  const setRemoteAnswer = async (userIdToConnect: string, answer:RTCSessionDescriptionInit) => {
    const peer = getPeer(userIdToConnect);
    await peer.setRemoteDescription(answer);
    console.log("Set Remote Answer");
  }

  const sendStream = async (stream: MediaStream) => {
    stream.getTracks().forEach(track => {
      // peer.addTrack(track, stream);
    });
  }

  const handleTrackEvent = (event: RTCTrackEvent) => {
    console.log("Track event: ", event);
    // You can handle the incoming track event here, e.g., attach it to a video element
  }

  // const handleReNegotiation = async () => {
  //   console.log("Re-negotiation needed");
  //   const offer = await peer.createOffer();
  //   await peer.setLocalDescription(offer);  
  // }

  // useEffect(()=>{
  //   peer.addEventListener('track', handleTrackEvent);
  //   peer.addEventListener('re-negotiationneeded', handleReNegotiation);
  //   return () => {
  //     peer.removeEventListener('track', handleTrackEvent);
  //     peer.removeEventListener('re-negotiationneeded', handleReNegotiation);
  //   }
  // }, [peer]);

  return { peers, createOffer, createAnswer, setRemoteAnswer, sendStream };
};
