// Server Component - Pagina de detalles de pelicula con i18n

import { notFound } from 'next/navigation';
import { getMovieDetailsFromStoreWithLocale, getCinemaMoviesFromStore } from '@/lib/api-server';
import { getDictionary } from '@/lib/i18n/dictionaries';
import MovieDetailsClient from './MovieDetailsClient';

export const runtime = "nodejs";

const DEFAULT_CITY = 'madrid';


export default async function MovieDetailsPage({ params, searchParams }) {
  const { id: movieId, lang } = await params;
  const { city = DEFAULT_CITY } = await searchParams;
  const dict = await getDictionary(lang);

  // Usar función con locale para obtener película traducida
  const movieData = await getMovieDetailsFromStoreWithLocale(movieId, lang);
  const sessionsData = await getCinemaMoviesFromStore(city);

  if (!movieData) {
    notFound();
  }

  const movieSession = sessionsData.find(s => s.id === parseInt(movieId));

  const movie = {
    ...movieData,
    showtimes: movieSession?.showtimes || [],
    format: movieSession?.format || 'standard'
  };

  return <MovieDetailsClient movie={movie} city={city} lang={lang} dict={dict} />;
}
