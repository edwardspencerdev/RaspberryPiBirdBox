"use client";
import { useLoaderData } from "react-router";
import { Header } from "./header";
import WebRTCPlayerElement from "./WebRTCPlayerElement";
import { Suspense } from "react";

export default function Home() {
  const {streamUrl} = useLoaderData() as {streamUrl : string};
  return (
    <>
      <Header/>
      <Suspense>
        <WebRTCPlayerElement streamUrl={streamUrl}/>
      </Suspense>
    </>
  );
}
