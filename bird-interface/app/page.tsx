"use client";
import { useWebRTCPlayer } from "./useWebRTCPlayer";
import { Header } from "./header";

export default function CameraPage() {
  const {videoRef, status} = useWebRTCPlayer("http://192.168.0.25:8889/view/whep");

  return (
    <>
      <Header/>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ width: "100%",background: "black", display: status === "connected" ? "block" : "none" }}
      />
      {status !== "connected" && (
        <p>
          {status === "connecting" ? "Connecting..." : "Connection failed"}
        </p>
      )}
    </>
  );
}
