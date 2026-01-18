import { NextResponse } from "next/server";
import store from "../_store";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const rating = searchParams.get("rating");

  const movies = store.get("movies") || [];

  if (rating === "top") {
    // Devolver películas ordenadas por rating (formato resumido)
    const topMovies = movies
      .map((movie) => ({
        id: movie.id,
        title: movie.title,
        genre: movie.genre,
        duration: movie.duration,
        rating: parseFloat(movie.rating), // Convertir "4.9/10" a 4.9
        poster: movie.poster,
        director: movie.director,
        year: movie.year
      }))
      .sort((a, b) => b.rating - a.rating);

    return NextResponse.json(topMovies);
  }

  // Sin filtro, devolver todas las películas en formato resumido
  const allMovies = movies.map((movie) => ({
    id: movie.id,
    title: movie.title,
    genre: movie.genre,
    duration: movie.duration,
    rating: parseFloat(movie.rating),
    poster: movie.poster,
    director: movie.director,
    year: movie.year
  }));

  return NextResponse.json(allMovies);
}
