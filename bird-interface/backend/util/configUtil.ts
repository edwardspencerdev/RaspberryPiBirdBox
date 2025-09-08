import sqlite3 from "sqlite3";

export async function UpdateIrEnableData(enable: any) {
    return new Promise<void>(async (resolve) => {const db = await new sqlite3.Database("./config.db", async (err) => {await db.run("UPDATE Configuration SET IrEnable = ?", enable); resolve();})});
}

export async function UpdatePortData(port: any) {
    return new Promise<void>(async (resolve) => {const db = await new sqlite3.Database("./config.db", async (err) => {await db.run("UPDATE Configuration SET CamPort = ?", port); resolve();})});
}

export async function UpdateAddressData(addr: any) {
    return new Promise<void>(async (resolve) => {const db = await new sqlite3.Database("./config.db", async (err) => {await db.run("UPDATE Configuration SET CamAddr = ?", addr); resolve();})});
}

export async function UpdateIrPinNumData(pinNum: any) {
    return new Promise<void>(async (resolve) => {const db = await new sqlite3.Database("./config.db", async (err) => {await db.run("UPDATE Configuration SET IrPinNum = ?", pinNum); resolve();})});
}

export async function IsLocalAddress() {
    return await new Promise<string | undefined>(async (resolve) => {const db = await new sqlite3.Database("./config.db", (err) => {db.get("SELECT CamAddr FROM Configuration", (err, rows) =>{resolve((rows as {CamAddr? : string})?.CamAddr )})})}) == "local";
}
