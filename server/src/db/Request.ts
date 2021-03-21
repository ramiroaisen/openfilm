import { Uid } from "../util";
import { CollectionGetter } from "./Connection"
import path from "path";
import { promises as fs, existsSync } from "fs";
import { BulkWriteOperation } from "mongodb";

const bodyDir = path.resolve(__dirname, "../../body");

export type Request = {
  id: string
  url: string
  path: string
  qs: string
  statusCode: number
  contentType: string | null
  body: string
  fetchAt: Date
  children: string[]
}

export namespace Request {

  export const uid = Uid(16);

  export const indexes = [
    { key: { id: 1 }, unique: true },
    { key: { url: 1 }, unique: true },
    { key: { path: 1 } },
    { key: { qs: 1 } },
    { key: { contentType: 1 } },
    { key: { statusCode: 1 } },
  ]

  export const getCollection = CollectionGetter<Request>("requests");

  getCollection().then(collection => {
    collection.createIndexes(indexes);
  })

  export const get = async (url: string): Promise<Request | null> => {
    const rs = await getCollection();
    return rs.findOne({ url });
  }

  export const readBody = async (request: Request): Promise<string> => {
    const filename = getBodyFilename(request.id);
    return fs.readFile(filename, "utf-8");
  }

  export const getBodyFilename = (id: string) => bodyDir + "/" + id + ".html";

  export const writeBody = async (request: Request, body: string) => {
    const filename = getBodyFilename(request.id);
    await fs.writeFile(filename, body);
  }
}

const displaceBodies = async () => {
  const rs = await Request.getCollection();
  const cursor = rs.find({ contentType: /^text\/html/, statusCode: 200 }).project({ _id: 0, id: 1, body: 1 })
  const total = await cursor.count();

  let i = 0;

  for await (const item of cursor) {
    console.log(++i, "/", total);
    const filename = bodyDir + "/" + item.id + ".html";
    if (existsSync(filename)) continue;
    await fs.writeFile(filename, item.body);
    await rs.updateOne({ id: item.id }, { $set: { body: "" } })
  }

  console.log("Bye!")
  process.exit();
}

const removeEmpty = async () => {
  const rs = await Request.getCollection();
  const ids = await rs.distinct("id");
  let count = 0;
  for (const id of ids) {
    const filename = Request.getBodyFilename(id);
    if (!existsSync(filename)) continue;
    const stat = await fs.stat(filename);
    if (stat.size === 0) {
      console.log(++count);
      await rs.deleteOne({ id });
      await fs.unlink(filename);
    }
  }

  console.log("Bye!")
  process.exit();

}

const addPath = async () => {
  const rs = await Request.getCollection();

  const urls = await rs.distinct("url", {path: null as any});

  console.log(urls.length, "urls");

  let i = 0;

  for (const url of urls) {
    console.log(++i, "/", urls.length);
    const u = new URL(url);
    await rs.updateOne({ url }, { $set: { path: u.pathname } });
  }

  process.exit();
}

const addQs = async () => {
  const rs = await Request.getCollection();
  const urls = await rs.distinct("url", {qs: null as any});

  console.log(urls.length, "urls");

  let i = 0;

  for (const url of urls) {
    console.log(++i, "/", urls.length);
    const u = new URL(url);
    console.log(u.search);
    await rs.updateOne({ url }, { $set: { qs: u.search } });
  }

  process.exit();
}


if (require.main === module) addQs();
