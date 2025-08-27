import { Header } from "../header";
import Form from 'next/form';
import { GET as GetCamAddr, IsLocalAddress} from "../api/camAddr/route";
import { GET as GetCamPort} from "../api/camPort/route";

export default async function SettingsPage(){
    let camAddr = await (await GetCamAddr()).text();
    const localCam = await IsLocalAddress();
    if (localCam) {
        camAddr = "Local (" + camAddr + ")";
    }
    const camPort = await (await GetCamPort()).text();
    return <>
        <Header/>
        <Form action="/api/updateConfiguration">
            <input name="useLocal" type="checkbox" defaultChecked={localCam}/>
            <input name="addr" type="text" defaultValue={camAddr}/>
            <input name="port" type="number" defaultValue={camPort}/>
            <input type="submit"/>
        </Form>
    </>
}
