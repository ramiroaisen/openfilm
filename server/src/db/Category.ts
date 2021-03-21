import { capitalize, slugify, Uid } from "../util";
import { CollectionGetter, CollectionUtils } from "./Connection";
import { Request } from "./Request";
import cheerio from "cheerio";

export type Category = {
  id: string
  slug: string
  name: string
  url: string
}

export namespace Category {

  export const uid = Uid(6);

  export const indexes = [
    { key: { id: 1 }, unique: true },
    { key: { slug: 1 }, unique: true },
    { key: { url: 1 }, unique: true },
    { key: { name: 1 } },
  ]

  export const getCollection = CollectionGetter<Category>("categories");

  getCollection().then(collection => collection.createIndexes(indexes));

  export const { map } = CollectionUtils(getCollection);

  export const populate = async () => {
    const cs = await Category.getCollection();
    const rs = await Request.getCollection();

    const requests = await rs.find({path: /^\/category\/[a-z0-9-]{2,}$/i, qs: ""}).toArray();

    const total = requests.length;
    console.log(total, "categories");

    let i = 0;
    
    const target: Category[] = [];

    for(const request of requests) {
      console.log(++i, "/", total, request.path);

      const body = await Request.readBody(request);
      const $ = cheerio.load(body);
      
      const id = Category.uid();
      const name = capitalize($("h1").html()!);
      const slug = slugify(name);
      
      console.log(name, "=>", slug);

      target.push({id, name, slug, url: request.url});
      
    }

    await cs.deleteMany({});
    await cs.insertMany(target);
  }

}

if(require.main === module) Category.populate().then(() => process.exit());
