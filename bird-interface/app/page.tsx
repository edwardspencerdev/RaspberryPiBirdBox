"use client";
import { useWebRTCPlayer } from "./useWebRTCPlayer";
import { Header } from "./header";

export default function CameraPage() {
  const videoRef = useWebRTCPlayer("http://192.168.0.25:8889/view/whep");

  return (
    <div>
      <Header/>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ width: "100%" }}
      />
    </div>
  );
}
