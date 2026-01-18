import { NextResponse } from "next/server";
import store from "../../_store";

export async function GET(request, { params }) {
  const { idMovie } = await params;
  const movieId = parseInt(idMovie, 10);

  const movies = store.get("movies") || [];
  const movie = movies.find((m) => m.id === movieId);

  if (!movie) {
    return NextResponse.json(
      { error: "Película no encontrada" },
      { status: 404 }
    );
  }

  // Devolver película completa con todos los campos
  return NextResponse.json({
    id: movie.id,
    title: movie.title,
    genre: movie.genre,
    duration: movie.duration,
    rating: movie.rating,
    synopsis: movie.synopsis,
    image: movie.image,
    director: movie.director,
    cast: movie.cast,
    year: movie.year
  });
}
