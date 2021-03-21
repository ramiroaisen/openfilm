import { Request } from "./Request";
import { slugify, Uid } from "../util";
import { CollectionGetter } from "./Connection"
import cheerio from "cheerio";
import { Category } from "./Category";
import { assert } from "console";

export type Movie = {
  id: string
  url: string
  c3id: number
  name: string
  listImageUrl: string
}

export type Movie2 = {
  id: string
  url: string
  c3id: number
  name: string
  slug: string
  listImageUrl: string
  categories: string[]
  year: number | null
  description: string
  streams: Movie.Stream[]
}

export namespace Movie {

  export type Stream = {
    type: string
    n: number
    provider: string
    url: string
  }

  export const uid = Uid(6);

  export const indexes = [
    { key: { id: 1 }, unique: true },
    { key: { c3id: 1 }, unique: true },
    { key: { url: 1 }, unique: true },
  ]

  export const getCollection = CollectionGetter<Movie>("movies");
  getCollection().then(collection => collection.createIndexes(indexes));


  export const indexes2 = [
    { key: { id: 1 }, unique: true },
    { key: { c3id: 1 }, unique: true },
    { key: { url: 1 }, unique: true },
    { key: { slug: 1 } },
  ]

  export const getCollection2 = CollectionGetter<Movie2>("movies2");
  getCollection2().then(collection => collection.createIndexes(indexes2))

  export const populate = async () => {
    const rs = await Request.getCollection();
    const ms = await Movie.getCollection();
    const pages = await rs.find({path: /^\/letter\//}).project({_id: 0, id: 1, url: 1}).sort({url: 1}).toArray();
    
    await ms.deleteMany({});

    let movieCount = 0;
    let i = 0;

    const urls: string[] = [];

    for(const page of pages) {

      const movies: Movie[] = [];      

      const body = await Request.readBody(page);
      const $ = cheerio.load(body);
      
      $(".MovieList .TPost > a[href]").each((i, item) => {
        ++i;
        const $a = $(item);
        const id = Movie.uid();
        const href = $a.attr("href")!;
        const url = new URL(href, page.url).href;
        if(urls.includes(url)) return;
        urls.push(url);
        const c3id = Number(href.match(/^\/(\d+)\//)![1])
        const name = $a.find(".Title").html()!.trim();
        const listImageUrl = new URL($a.find("img").attr("src")!, page.url).href;
        movies.push({ id, url, c3id, name, listImageUrl })
        movieCount++;
      })

      console.log("scrapped page", i, "of", pages.length, page.url, movies.length, "movies, total", movieCount);

      movies.length && await ms.insertMany(movies);
    }
  }

  export const upgrade = async () => {
    const ms1 = await Movie.getCollection();
    const srcs = await ms1.find().toArray();

    const ms2 = await Movie.getCollection2();
  
    const cs = await Category.getCollection();

    const total = srcs.length;
    console.log(total, "movies");

    const target: Movie2[] = [];

    let i = 0;
    for(const src of srcs) {
      
      console.log(++i, "/", total);

      const request = (await Request.get(src.url))!;
      const body = await Request.readBody(request);
      
      const $ = cheerio.load(body);

      const description = $(".Description").html()!.trim();
      const year = parseInt($("#top-single > div.backdrop > article > footer > p > span").html()!) || null;
      
      const categories: string[] = [];
      const $as = $('.AAico-adjust a[href^="https://www1.cuevana3.video/category/"]');
      
      for(const a of [].slice.call($as)) {
        const href = $(a).attr("href");
        const category = await cs.findOne({url: href});
        if(category != null) {
          categories.push(category.id);
        }
      }      

      const streams: Stream[] = [];
      
      $("li[data-video]").each((i, el) => {
        const txt = $(el).find(".cdtr > span").html()!;
        const parts = txt.split("-");

        const url = $(el).attr("data-video")!;
        const n = parseInt(parts[0].trim());
        const type =  slugify(parts[1]);
        const provider = slugify(parts[2]);

        assert(n, "n failed");
        assert(type, "type failed");
        assert(provider, "provider failed");

        streams.push({
          n,
          type,
          provider,
          url,
        })
      })

      target.push({
        id: src.id,
        name: src.name,
        slug: slugify(src.name),
        url: src.url,
        listImageUrl: src.listImageUrl,
        c3id: src.c3id,
        year,
        description,
        categories,
        streams,
      })
    }

    await ms2.deleteMany({});
    await ms2.insertMany(target);
  }

}

if(require.main === module) Movie.upgrade().then(() => process.exit());