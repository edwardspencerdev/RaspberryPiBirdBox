import { GetServerIp } from "@/app/util/ipAddrs";
import { UpdateAddressData } from "@/app/util/configUtil";
import { NextRequest } from "next/server";
import sqlite3 from "sqlite3";

export async function GET(){
    const db = await new Promise<string | undefined>(async (resolve) => {const db = await new sqlite3.Database("./config.db", (err) => {db.get("SELECT CamAddr FROM Configuration", (err, rows) =>{resolve((rows as {CamAddr? : string})?.CamAddr )})})});
    if (db == "local"){
        return new Response(GetServerIp())
    }
    return new Response(db);
}

export async function PUT(request: NextRequest){
    await UpdateAddressData(request.nextUrl.searchParams.get('addr'));
    return new Response()
}



