"use client";
import { Header } from "./header";
import { Suspense } from "react";
import WebRTCPlayerElement from "./util/WebRTCPlayerElement";

export default function CameraPage() {
  const addr = new Promise<string>(async (resolve) => {
    const ipFetch = fetch('/api/camAddr');
    const portFetch = fetch('/api/camPort');
    const ipRes = await (await ipFetch).text();
    const portRes = await (await portFetch).text();
    resolve("http://" + ipRes + ":" + portRes + "/view/whep");
  });
  
  return (
    <>
      <Header/>
      <Suspense>
        <WebRTCPlayerElement streamUrl={addr}/>
      </Suspense>
    </>
  );
}
