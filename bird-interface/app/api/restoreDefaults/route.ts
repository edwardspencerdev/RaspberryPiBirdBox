import sqlite3 from 'sqlite3';

export async function GET(){
    await new Promise<void>(async (resolve) => {const db = await new sqlite3.Database("./config.db", async (err) => {await db.run("DELETE FROM Configuration"); await db.run("INSERT INTO Configuration SELECT * FROM DefaultConfiguration"); resolve();})});
    return new Response();
}