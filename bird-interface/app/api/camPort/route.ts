import { NextRequest } from "next/server";
import { UpdatePortData } from "@/app/util/configUtil";
import sqlite3 from "sqlite3";

export async function GET(){
    const db = await new Promise<string | undefined>(async (resolve) => {const db = await new sqlite3.Database("./config.db", (err) => {db.get("SELECT CamPort FROM Configuration", (err, rows) =>{resolve((rows as {CamPort? : string})?.CamPort )})})});
    return new Response(db);
}

export async function PUT(request: NextRequest){
    await UpdatePortData(request.nextUrl.searchParams.get('port'));
    return new Response()
}
