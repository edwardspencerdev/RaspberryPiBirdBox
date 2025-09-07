"use client";
import { useEffect, useRef, useState } from "react";

export function useWebRTCPlayer(streamUrl: string | Promise<string>) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [status, setStatus] = useState<"connecting" | "connected" | "failed">(
    "connecting"
  );

  useEffect(() => {
    const pc = new RTCPeerConnection();

    // Force ICE gathering
    pc.createDataChannel("keepalive");

    // Ask for video track
    pc.addTransceiver("video", { direction: "recvonly" });

    pc.oniceconnectionstatechange = () => {
      console.log("ICE state:", pc.iceConnectionState);
      if (pc.iceConnectionState === "connected") setStatus("connected");
      else if (pc.iceConnectionState === "failed") setStatus("failed");
    };

    pc.ontrack = (event) => {
      console.log("Remote track received:", event.streams);
      if (videoRef.current) {
        videoRef.current.srcObject = event.streams[0];
        setStatus("connected"); // ensure we flip to connected once video arrives
      }
    };

    const start = async () => {
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        // Wait for ICE gathering to finish
        await new Promise<void>((resolve) => {
          if (pc.iceGatheringState === "complete") resolve();
          else {
            pc.addEventListener("icegatheringstatechange", () => {
              if (pc.iceGatheringState === "complete") resolve();
            });
          }
        });

        console.log("Sending SDP offer…");
        
        streamUrl = await Promise.resolve(streamUrl);

        const res = await fetch(streamUrl, {
          method: "POST",
          headers: { "Content-Type": "application/sdp" },
          body: pc.localDescription!.sdp || "",
        });
        
        const answerSdp = await res.text();
        console.log("Answer SDP:", answerSdp);

        await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });
      } catch (err) {
        console.error("WebRTC setup failed:", err);
        setStatus("failed");
      }
    };

    start();

    return () => pc.close();
  }, [streamUrl]);

  return { videoRef, status };
}
