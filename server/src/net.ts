import type {Response, Request, NextFunction} from "express";
import type WebSocket from "ws";

export const handler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void> | void) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next)
    } catch(e) {
      const statusCode = e.statusCode || 500;
      res.statusCode = statusCode;
      res.json({
        error: {statusCode: statusCode, message: e.message}
      })
    }
  }
}

export class APIError extends Error {
  public statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
} 

import {StatusCodes} from "http-status-codes";
import { sleep, Uid } from "./util";
export {StatusCodes};

export const nocache = (res: Response, force = false) => {
  res.setHeader("cache-control", "no-cache, no-store, must-revalidate");
  if(force) {
    const setHeader = res.setHeader;
    res.setHeader = function(key, value) {
      if(key.toLowerCase() !== "cache-control") {
        setHeader.call(res, key, value);
      }
    }
  }
}

export const EventStream = <T = any>(res: Response) => {
  res.writeHead(200, {"content-type": "text/event-stream"});
  const push = (...args: [T] | [string, any]) => {
    if(args.length === 1) {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    } else {
      res.write(`event: ${args[0]}\ndata: ${JSON.stringify(args[1])}\n\n`)
    }
  }
  return {push};
}

//const wsUid = Uid(3);

export const keepAlive = (ws: WebSocket) => {
  
  //const id = wsUid();
  //console.log(`open ${id}`)

  let interval: any;
  let responseTimer: any;
  let pong = false;

  //ws.on("pong", () => console.log(`pong ${id}`));
  //ws.on("close", () => console.log(`close ${id}`));

  ws.on("pong", () => pong = true);
  ws.on("close", () => { 
    clearInterval(interval);
    clearTimeout(responseTimer)
  });

  ws.on("message", data => {
    if(data.toString() === "ping") {
      ws.send("pong", () => {});
    }
  })

  const beat = async () => {
    pong = false;
    //console.log(`ping ${id}`)
    ws.ping(void 0, void 0, () => {});
    responseTimer = setTimeout(() => !pong && ws.terminate(), 3000);
  }

  interval = setInterval(beat, 5000);
}