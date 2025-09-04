import express  from "express";
import next from "next";

const server = express();
const port = 3000;
const nextApp = next({});
const nextHandle = nextApp.getRequestHandler();

nextApp.prepare();
/*

server.get('/{*splat}', (req, res) => {
  nextHandle(req, res);
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})*/