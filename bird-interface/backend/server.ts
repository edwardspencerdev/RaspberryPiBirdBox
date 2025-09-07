import express  from "express";
import path from "path";
import apiRouter from "./apiRouter.ts"

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
  console.log(`Example app listening on port ${port}`);
});