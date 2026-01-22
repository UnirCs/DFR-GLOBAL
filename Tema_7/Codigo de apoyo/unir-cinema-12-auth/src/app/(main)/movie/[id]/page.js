// Server Component - Pagina de detalles de pelicula
//
// El cache de fetch SOLO funciona en Server Components:
// - getMovieDetails: cache con revalidate hasta medianoche
// - getCinemaMovieSessions: cache con revalidate de 60 segundos
//
// La ciudad se obtiene del searchParams para cargar las sesiones correctas (SSR)

import { notFound } from 'next/navigation';
import { getMovieDetailsFromStore, getCinemaMoviesFromStore } from '@/lib/api-server';
import MovieDetailsClient from './MovieDetailsClient';


// Ciudad por defecto si no se especifica
const DEFAULT_CITY = 'madrid';


export default async function MovieDetailsPage({ params, searchParams }) {
  const { id: movieId } = await params;
  const { city = DEFAULT_CITY } = await searchParams;

  // Acceso directo a la base de datos (mas eficiente que fetch a si mismo)
  const movieData = await getMovieDetailsFromStore(movieId);
  const sessionsData = await getCinemaMoviesFromStore(city);

  // Si no se encuentra la película, mostrar 404
  if (!movieData) {
    notFound();
  }

  // Encontrar sesiones de esta película
  const movieSession = sessionsData.find(s => s.id === parseInt(movieId));

  // Combinar datos de película con sesiones
  const movie = {
    ...movieData,
    showtimes: movieSession?.showtimes || [],
    format: movieSession?.format || 'standard'
  };

  return <MovieDetailsClient movie={movie} city={city} />;
}
