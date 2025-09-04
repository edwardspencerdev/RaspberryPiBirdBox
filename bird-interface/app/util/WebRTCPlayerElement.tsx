'use client'
import { useWebRTCPlayer } from "./useWebRTCPlayer";

export default function Player(props : {streamUrl : string | Promise<string>}){
    const {videoRef, status} = useWebRTCPlayer(props.streamUrl);
    return <div>
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
    </div>
}