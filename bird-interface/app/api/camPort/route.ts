import { NextRequest } from "next/server";
import sqlite3 from "sqlite3";

export async function GET(){
    const db = await new Promise<string | undefined>(async (resolve) => {const db = await new sqlite3.Database("./config.db", (err) => {db.get("SELECT CamPort FROM Configuration", (err, rows) =>{resolve((rows as {CamPort? : string})?.CamPort )})})});
    return new Response(db);
}

export async function PUT(request: NextRequest){
    await new Promise<void>(async (resolve) => {const db = await new sqlite3.Database("./config.db", async (err) => {await db.run("UPDATE Configuration SET CamPort = ?", request.nextUrl.searchParams.get('port')); resolve();})});
    return new Response()
}