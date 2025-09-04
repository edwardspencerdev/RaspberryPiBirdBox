import sqlite3 from "sqlite3";
import { IsLocalAddress } from "@/app/util/configUtil";

export async function GET(){
    return new Response(await IsLocalAddress() ? "true" : "false")
}
