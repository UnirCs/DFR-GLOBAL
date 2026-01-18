// ============================================================================
// FUNCIONES DE ACCESO DIRECTO A LA BASE DE DATOS (solo para Server Components)
// ============================================================================
// Estas funciones acceden directamente a PostgreSQL.
// IMPORTANTE: Solo importar este archivo en Server Components.
// Para Client Components, usar las funciones de api.js que hacen fetch.
// ============================================================================

import {
  getCinemas as getCinemasDB,
  listMovies,
  getMovieById,
  getCinemaMoviesToday,
  getCinemaByCity
} from '@/app/api/v1/_store';
import {NextResponse} from "next/server";

const API_BASE_URL_MOCKED = "https://mock.apidog.com/m1/1172760-1166489-default";

/**
 * Obtiene la lista de cines directamente de la base de datos
 * Usar en generateStaticParams o Server Components
 */
export async function getCinemasFromStore() {
  const cinemas = await getCinemasDB();
  return cinemas.map((c) => c.city);
}

/**
 * Obtiene las peliculas directamente de la base de datos
 * Usar en generateStaticParams o Server Components
 */
export async function getMoviesFromStore() {
  const movies = await listMovies();
  return movies.map((movie) => ({
    id: movie.id,
    title: movie.title,
    genre: movie.genre,
    duration: movie.duration_text,
    rating: movie.rating_text,
    synopsis: movie.synopsis,
    image: movie.image,
    poster: movie.image,
    director: movie.director,
    cast: movie.casts,
    year: movie.year
  }));
}

/**
 * Obtiene las sesiones de un cine directamente de la base de datos
 * Usar en generateStaticParams o Server Components
 */
export async function getCinemaMoviesFromStore(cinemaId) {
  const movies = await getCinemaMoviesToday(cinemaId);
  return movies || [];
}

/**
 * Obtiene el detalle de una pelicula directamente de la base de datos
 * Usar en generateStaticParams o Server Components
 */
export async function getMovieDetailsFromStore(movieId) {
  const movie = await getMovieById(parseInt(movieId, 10));
  if (!movie) return null;

  return {
    id: movie.id,
    title: movie.title,
    genre: movie.genre,
    duration: movie.duration_text,
    rating: movie.rating_text,
    synopsis: movie.synopsis,
    image: movie.image,
    poster: movie.image,
    director: movie.director,
    cast: movie.casts,
    year: movie.year
  };
}

/**
 * Obtiene las metricas directamente (datos estaticos de demo)
 * Usar durante el build o en Server Components
 */
export async function getMetricsFromStore() {

  try {
    const response = await fetch(`${API_BASE_URL_MOCKED}/api/v1/metrics`);

    if (!response.ok) {
      throw new Error(`Error fetching metrics: ${response.status}`);
    }

    let metrics = await response.json();
    return metrics;

  } catch (error) {
    console.error('[METRICS] Error fetching from mock API:', error.message);
  }

  // Fallback a datos estaticos si falla el mock
  return {
    ticketsSoldToday: 150000,
    ticketsSoldMonth: 38542,
    minutesWatchedYear: 125400000,
    averageRating: 4.3,
    activeScreenings: 24,
    totalCustomers: 892341,
    updatedAt: new Date().toISOString()
  };
}

/**
 * Obtiene las peliculas top directamente de la base de datos (ordenadas por rating)
 * Usar durante el build o en Server Components
 */
export async function getTopMoviesFromStore() {
  const movies = await listMovies();
  return movies
    .map((movie) => ({
      id: movie.id,
      title: movie.title,
      genre: movie.genre,
      duration: movie.duration_text,
      rating: Number(movie.rating_value),
      poster: movie.image,
      director: movie.director,
      year: movie.year
    }))
    .sort((a, b) => b.rating - a.rating)
      .splice(0, 3);
}

/**
 * Obtiene los datos completos de peliculas para un cine directamente de la base de datos
 * Combina datos de sesiones + detalles de cada pelicula
 */
export async function getCinemaMoviesWithDetailsFromStore(cinemaId) {
  const sessions = await getCinemaMoviesToday(cinemaId);
  if (!sessions) return [];

  const movies = await listMovies();

  return sessions.map((session) => {
    const movieDetails = movies.find((m) => m.id === session.id);
    if (movieDetails) {
      return {
        id: movieDetails.id,
        title: movieDetails.title,
        genre: movieDetails.genre,
        duration: movieDetails.duration_text,
        rating: Number(movieDetails.rating_value),
        synopsis: movieDetails.synopsis,
        image: movieDetails.image,
        poster: movieDetails.image,
        director: movieDetails.director,
        cast: movieDetails.casts,
        year: movieDetails.year,
        showtimes: session.showtimes,
        format: session.format
      };
    }
    return null;
  }).filter(Boolean);
}
