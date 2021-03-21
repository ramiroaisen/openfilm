import mongodb, { Collection, MongoClient, ProjectionOperators, SchemaMember } from "mongodb";

export let connection: Promise<MongoClient> | null = null;

export const getConnection = (): Promise<MongoClient> => {
  if(!connection) connection = mongodb.connect("mongodb://localhost:27017/openfilm", {useNewUrlParser: true, useUnifiedTopology: true});
  return connection;
}


export const CollectionGetter = <T>(collectionName: string) => {
  return () => getConnection().then(connection => {
    return connection.db("openfilm").collection<T>(collectionName);
  })
}

type P<T> = SchemaMember<T, ProjectionOperators | number | boolean | any>;

export const CollectionUtils = <T extends {id: string}>(get: () => Promise<Collection<T>>, projection: P<T> = {_id: 0}) => {

  const map = async (ids: string[]) => {

    if(ids.length === 0) return [];
    
    const collection = await get();
    const items = await collection.find().project(projection).toArray();
    
    return ids.map(id => {
      return items.find(item => item.id === id)!;
    }).filter(Boolean)
  }

  return { map };
}