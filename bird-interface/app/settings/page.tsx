'use client'
import { Header } from "../header";
import Form from 'next/form';
import "./settingsGrid.css"
import { usePathname, useSearchParams } from "next/navigation";
import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import path from "path";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function SettingsPage(){
    const searchParams = useSearchParams();
    const router = useRouter()
    const pathname = usePathname();
    const [isSaved, setIsSaved] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const camAddrRef = useRef<HTMLInputElement | null>(null);
    const [camAddrVal, setCamAddr] = useState<string | null>(null);
    const camPortRef = useRef<HTMLInputElement | null>(null);
    const localCamRef = useRef<HTMLInputElement | null>(null);
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
        
        const loadedPromise = new Promise<void>(async (resolve) => {
            await localCamPromise
            await localAddrPromise;
            await addrPromise;
            await portPromise;
            setLoaded(true);
            resolve()
        });
    }, [loaded]);
    useEffect(() => {
        if (searchParams.has('saved')){
            setIsSaved(searchParams.get('saved') == "yes");
            setIsSaving(false);
            setLoaded(false);
        }
        router.replace(pathname)
    }, [searchParams])
    return <>
        <Header/>
        <Form action={(formData) => SendForm(formData, router, setIsSaving)} className="formContainer">
            <label className="useLocal" htmlFor="useLocal">Use Local IP Address For Camera: </label>
            <input className="useLocal" ref={localCamRef} onChange={() => OnLocalCheck(localCamRef, camAddrRef, camAddrVal || "", localAddrVal || "", setIsSaved, loaded)} name="useLocal" type="checkbox" defaultChecked={false}/>
            <label className="addr" htmlFor="addr">Camera IP Address: </label>
            <input className="addr" name="addr" type="text" defaultValue="0.0.0.0" ref={camAddrRef} onChange={() => RemoveSavedOnClick(setIsSaved, loaded)}/>
            <label className="port" htmlFor="port">Camera WebRTC Port: </label>
            <input className="port" name="port" type="number" defaultValue="0" ref={camPortRef} onChange={() => RemoveSavedOnClick(setIsSaved, loaded)}/>
            <button disabled={!loaded || isSaving}>{(!loaded || isSaving) ? "Loading Please Wait" : "Save Changes"}</button>
        </Form>
        <div className="saveContainer">
            <div className="textContainer">
                <p className="savedText" hidden={!isSaved} style={{color:"green", margin:"0px"}}>✅ Configuration saved</p>
            </div>
            <button className="undoButton" onClick={() => {setIsSaved(false); setLoaded(false)}}>Undo Changes</button>
            <button className="restoreButton" onClick={() => fetch("/api/restoreDefaults").then((res) => {setIsSaved(false); setLoaded(false)})}>Restore Defaults</button>
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

function SendForm(formData : FormData, router : AppRouterInstance, setIsSaving : Dispatch<SetStateAction<boolean>>){
    setIsSaving(true);
    router.replace("/api/updateConfiguration?" + new URLSearchParams(formData as any).toString())
}