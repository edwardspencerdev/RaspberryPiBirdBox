import { NextRequest } from "next/server";
import sqlite3 from "sqlite3";

export async function GET(){
    var db = await new Promise<string | undefined>(async (resolve) => {var db = await new sqlite3.Database("./config.db", (err) => {db.get("SELECT IrEnable FROM Configuration", (err, rows) =>{resolve((rows as {IrEnable? : string})?.IrEnable )})})});
    return new Response(db);
}

export async function PUT(request: NextRequest){
    await new Promise<void>(async (resolve) => {var db = await new sqlite3.Database("./config.db", async (err) => {await db.run("UPDATE Configuration SET IrEnable = ?", request.nextUrl.searchParams.get('enable')); resolve();})});
    return new Response()
}