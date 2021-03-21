
import {URL} from "url";
import { Request } from "./db/Request";
import chalk from "chalk";
import fetch from "node-fetch";
import cheerio from "cheerio";

const baseURL = new URL("https://www1.cuevana3.video");

export const crawl = async () => {
  
  const rs = await Request.getCollection();

  const elapsed = await rs.distinct("url");
  const queue = await rs.distinct("children");
  const ongoing: string[] = [];

  if(!queue.includes(baseURL.href)) {
    queue.push(baseURL.href)
  }

  for(const u of elapsed) {
    const i = queue.indexOf(u);
    if(i !== -1) queue.splice(i, 1);
  }

  const next = async (): Promise<void> => {
    const url = queue.shift();
    if(url == null) return;
    
    const u = new URL(url);
    ongoing.push(url);
    

    try {
      const res = await fetch(url);
      const statusCode = res.status;
      const contentType = res.headers.get("content-type");
      if(statusCode === 200 && contentType?.startsWith("text/html")) {
        const body = await res.text();
        const $ = cheerio.load(body);
        const $as = $("a[href]");

        let base: URL;

        const $base = $("base[href]");
        if($base.length) {
          base = new URL($base.attr("href")!, url);
        } else {
          base = new URL(url);
        }

        const children: string[] = [];

        $as.each((i, a) => {
          const $a = $(a);
          const href = $a.attr("href")!;
          const u = new URL(href, base);
          u.hash = "";
          if(u.origin !== baseURL.origin) return;
          if(!children.includes(u.href)) {
            children.push(u.href);
          }
        })

        for(const child of children) {
          if(
            !elapsed.includes(child) &&
            !queue.includes(child) && 
            !ongoing.includes(child)
          ) queue.push(child);
        }

        const request: Request = {
          id: Request.uid(),
          url,
          path: u.pathname,
          qs: u.search,
          statusCode,
          contentType,
          body: "",
          fetchAt: new Date,
          children
        };

        await Request.writeBody(request, body)
        await rs.insertOne(request);

      } else {
        const request: Request = {
          id: Request.uid(),
          url,
          body: "",
          path: u.pathname,
          qs: u.search,
          contentType,
          statusCode,
          fetchAt: new Date,
          children: [],
        }

        await rs.insertOne(request);
      }
      
    } catch(e) {
      await rs.insertOne({
        id: Request.uid(),
        url,
        path: u.pathname,
        qs: u.search,
        statusCode: 0,
        contentType: null,
        body: "",
        children: [],
        fetchAt: new Date
      })
    }

    const i = ongoing.indexOf(url);
    if(i !== -1) ongoing.splice(i, 1);

    elapsed.push(url);

    return next();
  }

  const render = () => {
    let buffer = "";
    let lines = 0;
    const w = (s: string) => {
      lines++;
      buffer += s + "\n";
    }

    w(`===== crawling ${baseURL.hostname} =====`);
    w(`== Elapsed: ${chalk.yellow(elapsed.length)}`);
    w(`== Queue: ${chalk.yellow(queue.length)}`);
    w(`== Ongoing: ${chalk.yellow(ongoing.length)}`);
    w("========================================");

    const height = process.stdout.getWindowSize()[1];
    let i = 0;
    while(lines <= height) {
      const url = ongoing[i++];
      if(url == null) break;
      w(url);
    }

    process.stdout.cursorTo(0, 0);
    process.stdout.clearScreenDown();
    process.stdout.write(buffer);
  }

  setInterval(render, 250);

  await Promise.all(Array(10).fill(0).map(next));

  render();
  process.exit();
}

if(require.main === module) crawl();
