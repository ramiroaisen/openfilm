import { Router } from "express"
import { Category } from "./db/Category";
import { Movie } from "./db/Movie";
import { APIError, handler, StatusCodes } from "./net";

export const api = () => {
  
  const api = Router();

  api.get("/", handler(async (req, res) => {
    const ms = await Movie.getCollection2();
    const sample = await ms.aggregate([
      {$sample: {size: 60}}
    ]).toArray();

    res.json({sample});
  }));

  api.get("/peliculas/:id", handler(async (req, res) => {

    const ms = await Movie.getCollection2();
    const movie = await ms.findOne({id: req.params.id});

    if(movie == null) throw new APIError(StatusCodes.NOT_FOUND, "Ups! La pelicula que estas buscando no existe");

    const categories = await Category.map(movie.categories);

    res.json({
      movie, categories
    })

  }))

  return api;
}