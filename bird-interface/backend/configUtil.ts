import {UpdateGpioState} from "./gpioControls.ts";
import sqlite3 from "sqlite3";

export async function GetIrEnableData() : string {
    return await new Promise<string | undefined>(async (resolve) => {const db = await new sqlite3.Database("./config.db", (err) => {db.get("SELECT IrEnable FROM Configuration", (err, rows) =>{resolve((rows as {IrEnable? : string})?.IrEnable )})})});
}

export async function GetIrPinNumData() : string {
    return await new Promise<string | undefined>(async (resolve) => {const db = await new sqlite3.Database("./config.db", (err) => {db.get("SELECT IrPinNum FROM Configuration", (err, rows) =>{resolve((rows as {IrPinNum? : string})?.IrPinNum )})})});
}

export async function UpdateIrEnableData(enable: any) {
    return new Promise<void>(async (resolve) => {const db = await new sqlite3.Database("./config.db", async (err) => {await db.run("UPDATE Configuration SET IrEnable = ?", enable); UpdateGpioState(); resolve();})});
}

export async function UpdatePortData(port: any) {
    return new Promise<void>(async (resolve) => {const db = await new sqlite3.Database("./config.db", async (err) => {await db.run("UPDATE Configuration SET CamPort = ?", port); resolve();})});
}

export async function UpdateAddressData(addr: any) {
    return new Promise<void>(async (resolve) => {const db = await new sqlite3.Database("./config.db", async (err) => {await db.run("UPDATE Configuration SET CamAddr = ?", addr); resolve();})});
}

export async function UpdateIrPinNumData(pinNum: any) {
    return new Promise<void>(async (resolve) => {const db = await new sqlite3.Database("./config.db", async (err) => {await db.run("UPDATE Configuration SET IrPinNum = ?", pinNum); UpdateGpioState(); resolve();})});
}

export async function IsLocalAddress() {
    return await new Promise<string | undefined>(async (resolve) => {const db = await new sqlite3.Database("./config.db", (err) => {db.get("SELECT CamAddr FROM Configuration", (err, rows) =>{resolve((rows as {CamAddr? : string})?.CamAddr )})})}) == "local";
}
