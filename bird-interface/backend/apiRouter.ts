import { Router } from "express";
import sqlite3 from "sqlite3";
import { IsLocalAddress, UpdateAddressData, UpdatePortData, UpdateIrEnableData, UpdateIrPinNumData, GetIrEnableData, GetIrPinNumData } from "./configUtil.ts";
import { GetServerIp } from "./ipAddrs.ts";
import {UpdateGpioState} from "./gpioControls.ts"

const apiRouter = Router(); 

apiRouter.get("/camAddr/isLocal", async (req, res) => {
    res.send(await IsLocalAddress() ? "true" : "false")
});

apiRouter.get("/camAddr", async (req, res) => {
    let db = await new Promise<string | undefined>(async (resolve) => {const db = await new sqlite3.Database("./config.db", (err) => {db.get("SELECT CamAddr FROM Configuration", (err, rows) =>{resolve((rows as {CamAddr? : string})?.CamAddr )})})});
    if (db == "local"){
        db = GetServerIp() || "Error Getting Local Address";
    }
    res.send(db);
});

apiRouter.get("/camPort", async (req, res) => {
  const db = await new Promise<string | undefined>(async (resolve) => {const db = await new sqlite3.Database("./config.db", (err) => {db.get("SELECT CamPort FROM Configuration", (err, rows) =>{resolve((rows as {CamPort? : string})?.CamPort )})})});
  res.send(db);
});

apiRouter.get("/irEnable", async (req, res) => {
    const db = await GetIrEnableData();
    res.send(db);
});

apiRouter.get("/irPinNum", async (req, res) => {
    const db = await GetIrPinNumData();
    res.send(db);
});

apiRouter.get("/localAddr", async (req, res) => {
    res.send(GetServerIp());
});

apiRouter.get("/restoreDefaults", async (req, res) => {
    await new Promise<void>(async (resolve) => {const db = await new sqlite3.Database("./config.db", async (err) => {await db.run("DELETE FROM Configuration"); await db.run("INSERT INTO Configuration SELECT * FROM DefaultConfiguration"); resolve();})});
    UpdateGpioState();
    res.sendStatus(200);
});

apiRouter.get("/updateConfiguration", async (req, res) => {
    if (req.query.useLocal == "on"){
    	await UpdateAddressData('local');
    }
    else {
    	await UpdateAddressData(req.query.addr);
    }
    await UpdatePortData(req.query.port);
    await UpdateIrEnableData(req.query.irEnable == "on" ? true : false);
    await UpdateIrPinNumData(req.query.irPinNum);
    res.redirect('/settings?saved=yes');
    
});

export default apiRouter;
