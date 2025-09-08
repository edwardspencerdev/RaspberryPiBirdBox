import express  from "express";
import path from "path";
import exitHook from "exit-hook";
import apiRouter from "./apiRouter.ts"
import { UpdateGpioState, DeinitOld } from "./gpioControls.ts"
import {GetServerIp} from "./ipAddrs.ts";

await UpdateGpioState();
exitHook(signal => {DeinitOld();});

const server = express();
const port = 3000;

server.use((req, res, next) => {
  console.log(req.url);
  next();
});

server.use("/api", apiRouter);

server.use(express.static("../frontend/dist"));

server.get("*splat", (req, res) => {
  res.sendFile(path.resolve("../frontend/dist/index.html"));
});

server.listen(port, () => {
  console.log("Camera Web Server Avaliable at http://" + GetServerIp() + ":" + port + "/");
});
