"use client";
import { useEffect, useRef } from "react";

export function useWebRTCPlayer(streamUrl: string) {
  const videoRef = useRef<any>(null);

  useEffect(() => {
    console.log("Starting WebRTC hook for:", streamUrl);

    const pc = new RTCPeerConnection();

    pc.oniceconnectionstatechange = () => {
      console.log("ICE state:", pc.iceConnectionState);
    };

    pc.ontrack = (event) => {
      console.log("Remote track received:", event.streams);
      if (videoRef.current) {
        videoRef.current.srcObject = event.streams[0];
      }
    };

    pc.createDataChannel("keepalive"); // forces ICE gathering
    pc.addTransceiver("video", { direction: "recvonly" });

    const start = async () => {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Wait for ICE
      await new Promise<void>((resolve) => {
        if (pc.iceGatheringState === "complete") {
            console.log("ICE already complete");
            resolve();
        } else {
            console.log("Waiting for ICE candidates...");
            const checkState = () => {
            console.log("ICE state change:", pc.iceGatheringState);
            if (pc.iceGatheringState === "complete") {
                pc.removeEventListener("icegatheringstatechange", checkState);
                resolve();
            }
            };
            pc.addEventListener("icegatheringstatechange", checkState);
        }
        });

      console.log("Sending SDP offer…");

      const res = await fetch(streamUrl, {
        method: "POST",
        headers: { "Content-Type": "application/sdp" },
        body: pc.localDescription.sdp,
      });

      const answerSdp = await res.text();
      console.log("Answer SDP:", answerSdp);
      await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });
    };

    start();

    return () => pc.close();
  }, [streamUrl]);

  return videoRef;
}
