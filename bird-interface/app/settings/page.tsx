'use client'
import { Header } from "../header";
import Form from 'next/form';
import "./settingsGrid.css"
import { useSearchParams } from "next/navigation";
import { RefObject, useEffect, useRef, useState } from "react";

export default function SettingsPage(){
    let isSaved = useSearchParams().get("saved") == "yes";
    const camAddrRef = useRef<HTMLInputElement | null>(null);
    const [camAddrVal, setCamAddr] = useState<string | null>(null);
    const camPortRef = useRef<HTMLInputElement | null>(null);
    const localCamRef = useRef<HTMLInputElement | null>(null);
    const [loaded, setLoaded] = useState<boolean>(false);
    useEffect(() => {
        const localCamPromise = fetch("/api/camAddr/isLocal").then((res) => res.text()).then((text) => text == "true");
        const addrPromise = fetch("/api/camAddr").then((res) => res.text())
        .then(async (newAddr) =>{
            setCamAddr(newAddr);
            const newLocal = await localCamPromise;
            if(localCamRef.current){
                localCamRef.current.checked = newLocal;
            }
            if(camAddrRef.current){
                camAddrRef.current.value = FormatIfLocal(newLocal, newAddr);
            }
        });
        const portPromise = fetch("/api/camPort").then((res) => res.text()).then((text) => {if (camPortRef.current){camPortRef.current.value = text;}});
        
        const loadedPromise = new Promise<void>(async (resolve) => {
            await localCamPromise
            await addrPromise;
            await portPromise;
            setLoaded(true);
            resolve()
        });
    }, []);
    return <>
        <Header/>
        <Form action="/api/updateConfiguration" className="formContainer">
            <label className="useLocal" htmlFor="useLocal">Use Local IP Address For Camera: </label>
            <input className="useLocal" ref={localCamRef} onClick={() => OnLocalCheck(localCamRef, camAddrRef, camAddrVal)} name="useLocal" type="checkbox" defaultChecked={false}/>
            <label className="addr" htmlFor="addr">Camera IP Address: </label>
            <input className="addr" name="addr" type="text" defaultValue="0.0.0.0" ref={camAddrRef}/>
            <label className="port" htmlFor="port">Camera WebRTC Port: </label>
            <input className="port" name="port" type="number" defaultValue="0" ref={camPortRef}/>
            <button disabled={!loaded}>{loaded ? "Save Changes" : "Loading Please Wait"}</button>
        </Form>
        <p hidden={!isSaved} style={{color:"green"}}>✅ Configuration saved</p>
    </>
}

function FormatIfLocal(localCam: boolean, camAddr: string) : string{
    if (localCam) {
        return "Local (" + camAddr + ")";
    }
    return camAddr;
}

async function OnLocalCheck(localCamRef : RefObject<HTMLInputElement | null>, camAddrRef : RefObject<HTMLInputElement | null>, camAddrVal : string) {
    if (camAddrRef.current && localCamRef.current) {camAddrRef.current.value = FormatIfLocal(localCamRef.current.checked, camAddrVal);}
}