"use client";
import { useWebRTCPlayer } from "./useWebRTCPlayer";
import { Header } from "./header";

export default function CameraPage() {
  var addr = new Promise<string>(async (resolve) => {
    var ipFetch = fetch('/api/camAddr');
    var portFetch = fetch('/api/camPort');
    var ipRes = await (await ipFetch).text();
    var portres = await (await portFetch).text();
    resolve("http://" + ipRes + ":" + portres + "/view/whep");
  });
  var {videoRef, status} = useWebRTCPlayer(addr);
  
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
