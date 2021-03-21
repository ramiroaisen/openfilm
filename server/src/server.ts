import express from "express";
import serve from "serve-static";
import path from "path";
import { api } from "./api";
import { json } from "body-parser";

export const start = async (sapper: { app: any }) => {

  const app = express();

  app.use(serve(path.resolve(__dirname, "../../static")));

  app.use(json());
  app.use("/api", api());

  app.use(sapper.app({
    session: () => ({})
  }));

  app.listen(4888, () => {
    console.log("app listening at port", 4888);
  })
}