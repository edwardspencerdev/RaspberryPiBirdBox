"use client";
import { useWebRTCPlayer } from "./useWebRTCPlayer";
import { Header } from "./header";

export default function CameraPage() {
  const addr = new Promise<string>(async (resolve) => {
    const ipFetch = fetch('/api/camAddr');
    const portFetch = fetch('/api/camPort');
    const ipRes = await (await ipFetch).text();
    const portres = await (await portFetch).text();
    resolve("http://" + ipRes + ":" + portres + "/view/whep");
  });
  const {videoRef, status} = useWebRTCPlayer(addr);
  
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
