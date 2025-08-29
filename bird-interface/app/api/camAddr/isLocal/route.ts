import sqlite3 from "sqlite3";

export async function GET(){
    return new Response(await IsLocalAddress() ? "true" : "false")
}

export async function IsLocalAddress() {
    return await new Promise<string | undefined>(async (resolve) => {const db = await new sqlite3.Database("./config.db", (err) => {db.get("SELECT CamAddr FROM Configuration", (err, rows) =>{resolve((rows as {CamAddr? : string})?.CamAddr )})})}) == "local";
}