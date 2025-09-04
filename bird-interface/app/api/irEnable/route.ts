import { NextRequest } from "next/server";
import sqlite3 from "sqlite3";
import { UpdateIrData } from "@/app/util/configUtil";

export async function GET(){
    const db = await new Promise<string | undefined>(async (resolve) => {const db = await new sqlite3.Database("./config.db", (err) => {db.get("SELECT IrEnable FROM Configuration", (err, rows) =>{resolve((rows as {IrEnable? : string})?.IrEnable )})})});
    return new Response(db);
}

export async function PUT(request: NextRequest){
    await UpdateIrData(request.nextUrl.searchParams.get('irEnable'));
    return new Response();
}
