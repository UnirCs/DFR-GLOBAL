import { NextResponse } from "next/server";
import store from "../../../_store";

export async function GET(request, { params }) {
  const { cinema } = await params;

  const cinemas = store.get("cinemas") || [];
  const cinemaMovies = store.get("cinemaMovies") || {};

  // Verificar si el cine existe (case-insensitive)
  const cinemaName = cinemas.find(
    (c) => c.toLowerCase() === cinema.toLowerCase()
  );

  if (!cinemaName) {
    return NextResponse.json(
      { error: "Cine no encontrado" },
      { status: 404 }
    );
  }

  const movies = cinemaMovies[cinemaName] || [];

  return NextResponse.json(movies);
}
