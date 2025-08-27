import { NextRequest } from "next/server";
import sqlite3 from "sqlite3";

export async function GET(){
    const db = await new Promise<string | undefined>(async (resolve) => {const db = await new sqlite3.Database("./config.db", (err) => {db.get("SELECT IrEnable FROM Configuration", (err, rows) =>{resolve((rows as {IrEnable? : string})?.IrEnable )})})});
    return new Response(db);
}

export async function PUT(request: NextRequest){
    await UpdateIrData(request.nextUrl.searchParams.get('irEnable'));
    return new Response();
}

export async function UpdateIrData(enable: any) {
    return new Promise<void>(async (resolve) => {const db = await new sqlite3.Database("./config.db", async (err) => {await db.run("UPDATE Configuration SET IrEnable = ?", enable); resolve();})});
}