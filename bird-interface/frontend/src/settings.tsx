'use client'
import { Header } from "./header";
import { useSearchParams } from "react-router";
import type { Dispatch, RefObject, SetStateAction} from "react"
import { useEffect, useRef, useState } from "react";

import "./settingsGrid.css"

export default function SettingsPage(){
    const searchParams = useSearchParams();
    //const pathname = useLocation().pathname;
    const [isSaved, setIsSaved] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const camAddrRef = useRef<HTMLInputElement | null>(null);
    const [camAddrVal, setCamAddr] = useState<string | null>(null);
    const camPortRef = useRef<HTMLInputElement | null>(null);
    const localCamRef = useRef<HTMLInputElement | null>(null);
    const irEnableRef = useRef<HTMLInputElement | null>(null);
    const irPinNumRef = useRef<HTMLInputElement | null>(null);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [localAddrVal, setLocalAddr] = useState<string | null>(null)
    useEffect(() => {
        if (loaded) return;
        const localCamPromise = fetch("/api/camAddr/isLocal").then((res) => res.text()).then((text) => text == "true");
        const localAddrPromise = new Promise<string>(async (resolve) => {const addr = await fetch("/api/localAddr").then((res) => res.text()); setLocalAddr(addr); resolve(addr)});
        const addrPromise = fetch("/api/camAddr").then((res) => res.text())
        .then(async (newAddr) =>{
            setCamAddr(newAddr);
            const newLocal = await localCamPromise;
            const newLocalAddr = await localAddrPromise;
            if(localCamRef.current){
                localCamRef.current.checked = newLocal;
            }
            if(camAddrRef.current){
                camAddrRef.current.value = FormatIfLocal(newLocal, newAddr, newLocalAddr);
            }
        });
        const portPromise = fetch("/api/camPort").then((res) => res.text()).then((text) => {if (camPortRef.current){camPortRef.current.value = text;}});
        const irEnablePromise = fetch("/api/irEnable").then((res) => res.text()).then((text) => text == "1");
	const irPinNumPromise = fetch("/api/irPinNum").then((res) => res.text())
	.then(async (pinNum) => {
	    const irIsEnable = await irEnablePromise;
	    if(irEnableRef.current){
		irEnableRef.current.checked = irIsEnable;
	    }
	    if(irPinNumRef.current){
		irPinNumRef.current.value = pinNum;
	    }
	});
        new Promise<void>(async (resolve) => {
            await localCamPromise
            await localAddrPromise;
            await addrPromise;
            await portPromise;
	    await irEnablePromise;
	    await irPinNumPromise;
            setLoaded(true);
            resolve()
        });
    }, [loaded]);
    useEffect(() => {
        if (searchParams[0].has('saved')){
            setIsSaved(searchParams[0].get('saved') == "yes");
            setIsSaving(false);
            setLoaded(false);
            searchParams[1](new URLSearchParams())
        }
    }, [searchParams])
    return <>
        <Header/>
        <form action={(formData) => SendForm(formData, setIsSaving)} className="formContainer">
            <label className="useLocal" htmlFor="useLocal">Use Local IP Address For Camera: </label>
            <input className="useLocal" ref={localCamRef} onChange={() => OnLocalCheck(localCamRef, camAddrRef, camAddrVal || "", localAddrVal || "", setIsSaved, loaded)} name="useLocal" type="checkbox" defaultChecked={false}/>
            <label className="addr" htmlFor="addr">Camera IP Address: </label>
            <input className="addr" name="addr" type="text" defaultValue="0.0.0.0" ref={camAddrRef} onChange={() => RemoveSavedOnClick(setIsSaved, loaded)}/>
            <label className="port" htmlFor="port">Camera WebRTC Port: </label>
            <input className="port" name="port" type="number" defaultValue="0" ref={camPortRef} onChange={() => RemoveSavedOnClick(setIsSaved, loaded)}/>
	    <label className="irEnable" htmlFor="irEnable">IR Enable: </label>
	    <input className="irEnable" ref={irEnableRef} name="irEnable" type="checkbox" defaultChecked={false} onChange={() => RemoveSavedOnClick(setIsSaved, loaded)}/>
	    <label className="irPinNum" htmlFor="irPinNum">IR Pin Number: </label>
	    <input className="irPinNum" name="irPinNum" type="number" defaultValue="0" ref={irPinNumRef} onChange={() => RemoveSavedOnClick(setIsSaved, loaded)}/>
            <button disabled={!loaded || isSaving}>{(!loaded || isSaving) ? "Loading Please Wait" : "Save Changes"}</button>
        </form>
        <div className="saveContainer">
            <div className="textContainer">
                <p className="savedText" hidden={!isSaved} style={{color:"green", margin:"0px"}}>✅ Configuration saved</p>
            </div>
            <button className="undoButton" onClick={() => {setIsSaved(false); setLoaded(false)}}>Undo Changes</button>
            <button className="restoreButton" onClick={() => fetch("/api/restoreDefaults").then((_res) => {setIsSaved(false); setLoaded(false)})}>Restore Defaults</button>
        </div>
    </>
}

function FormatIfLocal(localCam: boolean, camAddr: string, localAddr : string) : string{
    if (localCam) {
        return "Local (" + localAddr + ")";
    }
    return camAddr;
}

function OnLocalCheck(localCamRef : RefObject<HTMLInputElement | null>, camAddrRef : RefObject<HTMLInputElement | null>, camAddrVal : string, localAddrVal : string, saveSetter : Dispatch<SetStateAction<boolean>>, loaded : boolean) {
    RemoveSavedOnClick(saveSetter, loaded);
    if (camAddrRef.current && localCamRef.current) {
        camAddrRef.current.value = FormatIfLocal(localCamRef.current.checked, camAddrVal, localAddrVal);
        camAddrRef.current.disabled = localCamRef.current.checked;
    }
}

function RemoveSavedOnClick(saveSetter : Dispatch<SetStateAction<boolean>>, loaded : boolean){
    if (!loaded) {return;}
    saveSetter(false);
}


function SendForm(formData : FormData, setIsSaving : Dispatch<SetStateAction<boolean>>){
    setIsSaving(true);
    console.log(formData)
    window.location.href = ("/api/updateConfiguration?" + new URLSearchParams(formData as any).toString())
}
