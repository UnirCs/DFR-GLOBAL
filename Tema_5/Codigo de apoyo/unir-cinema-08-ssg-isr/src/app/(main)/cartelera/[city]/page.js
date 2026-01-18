// Server Component - Cartelera de cine por ciudad
//
// Esta página demuestra el cache de Next.js:
// - getCinemas(): force-cache (cache permanente)
// - getCinemaMovieSessions(): revalidate cada 60 segundos
// - getMovieDetails(): revalidate hasta medianoche
//
// Al ser Server Component, los datos se obtienen en el servidor
// y el cache de Next.js funciona correctamente.

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCinemas, getCinemaMoviesWithDetails } from '@/lib/api';
import MoviesList from './MoviesList';
import CitySyncClient from './CitySyncClient';

export default async function CarteleraPage({ params }) {
  const { city } = await params;

  // Validar que la ciudad existe (usa cache force-cache)
  const cinemas = await getCinemas();
  const validCities = cinemas.map(c => c.toLowerCase());

  if (!validCities.includes(city.toLowerCase())) {
    notFound();
  }

  // Obtener películas con sus detalles (usa cache con revalidate)
  const movies = await getCinemaMoviesWithDetails(city);

  const cityName = city.charAt(0).toUpperCase() + city.slice(1);

  return (
    <div className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
      {/* Sincronizar la ciudad del contexto con la URL */}
      <CitySyncClient city={city} />

      {/* Header con título y link a información del cine */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-cinema-gold text-2xl font-bold">
          🎬 Cartelera {cityName}
        </h1>

        <Link
          href={`/cinema/${city}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-cinema-dark-elevated border border-cinema-border rounded-lg text-cinema-text-muted hover:text-cinema-gold hover:border-cinema-gold transition-all duration-300"
        >
          <span>ℹ️</span>
          <span>Info del cine</span>
        </Link>
      </div>

      {movies.length === 0 ? (
        <div className="text-cinema-text-muted text-center py-10">
          No hay películas disponibles en este cine
        </div>
      ) : (
        <MoviesList movies={movies} city={city} />
      )}
    </div>
  );
}

