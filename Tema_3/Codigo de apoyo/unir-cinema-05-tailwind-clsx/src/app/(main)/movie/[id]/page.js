'use client';

// Client Component - Página de detalles de película:
// - useRouter para navegación programática (botón volver)
// - useSearchParams para obtener parámetros de URL
// - Accede al contexto global para obtener datos de película
// - Tema oscuro de cine permanente
// - Uso de clsx para organizar las clases de Tailwind

import { use, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import { useMovies } from '@/hooks/useMovies';
import styles from '../MovieDetails.module.css';

function MovieDetailsContent({ movieId }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getMovieById } = useMovies();

  const movie = getMovieById(movieId);
  const selectedDate = searchParams.get('date');

  // Si no se encuentra la película, mostrar el not-found del grupo
  if (!movie) {
    notFound();
  }

  // Clases reutilizables
  const infoCardClasses = clsx(
    'bg-cinema-dark-elevated p-3 rounded-lg text-center',
    'border border-cinema-border',
    'hover:border-cinema-gold transition-colors'
  );

  const backButtonClasses = clsx(
    'mb-6 bg-gradient-to-r from-cinema-gold to-cinema-gold-dark',
    'text-cinema-dark px-5 py-2 rounded-lg font-bold',
    'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cinema-gold/50',
    'transition-all duration-300'
  );

  const sessionLinkClasses = clsx(
    styles.sessionLink,
    'px-5 py-2 bg-gradient-to-r from-cinema-red to-cinema-red-dark',
    'text-white rounded-full font-semibold',
    'shadow-lg shadow-cinema-red/30',
    'hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cinema-red/50 hover:brightness-110',
    'transition-all duration-300'
  );

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div className={clsx(
        'bg-gradient-to-br from-cinema-dark-card to-cinema-dark-elevated',
        'p-6 md:p-8 rounded-2xl shadow-lg border border-cinema-border'
      )}>
        <button onClick={() => router.back()} className={backButtonClasses}>
          ← Volver
        </button>

        {/* Header con poster e info */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Poster */}
          <div className={clsx(
            'relative w-full md:w-[300px] md:min-w-[300px] h-[400px] md:h-[450px]',
            'rounded-xl overflow-hidden shadow-lg',
            'border-2 border-cinema-border flex-shrink-0'
          )}>
            <Image
              src="/film-poster.jpg"
              alt={`Poster de ${movie.title}`}
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              priority
              className="object-cover"
            />
          </div>

          {/* Info principal */}
          <div className="flex-1">
            <h1 className="text-cinema-gold text-3xl md:text-4xl font-bold mb-4 pb-4 border-b-4 border-cinema-red">
              {movie.title}
            </h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {[
                { label: 'Género', value: movie.genre },
                { label: 'Duración', value: movie.duration },
                { label: 'Valoración', value: `⭐ ${movie.rating}` },
                { label: 'Año', value: movie.year },
                { label: 'Director', value: movie.director },
              ].map((item) => (
                <div key={item.label} className={infoCardClasses}>
                  <strong className="text-cinema-gold text-sm block mb-1">{item.label}</strong>
                  <span className="text-cinema-text-muted text-sm">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reparto */}
        <section className="mb-6">
          <h3 className="text-cinema-gold text-xl font-bold mb-2">Reparto:</h3>
          <p className="text-cinema-text-muted leading-relaxed">{movie.cast.join(', ')}</p>
        </section>

        {/* Sinopsis */}
        <section className="mb-6">
          <h3 className="text-cinema-gold text-xl font-bold mb-2">Sinopsis:</h3>
          <p className="text-cinema-text-muted leading-relaxed">{movie.synopsis}</p>
        </section>

        {selectedDate && (
          <div className="mb-6 p-4 bg-cinema-dark-elevated rounded-lg border-l-4 border-cinema-gold">
            <p className="text-cinema-text-muted">
              <strong className="text-cinema-gold">Fecha seleccionada:</strong> {selectedDate}
            </p>
          </div>
        )}

        {/* Sesiones */}
        <section className="pt-6 border-t border-cinema-border">
          <h3 className="text-cinema-gold text-xl font-bold mb-4">🎟️ Seleccionar horario:</h3>
          <div className="flex flex-wrap gap-3">
            {movie.showtimes.map((time, index) => (
              <Link
                key={index}
                href={`/movie/${movie.id}/session/${time}`}
                className={sessionLinkClasses}
              >
                {time}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function MovieDetailsPage({ params }) {
  const resolvedParams = use(params);

  return (
    <Suspense fallback={<div className="flex-1 p-8 text-center text-cinema-text-muted">Cargando...</div>}>
      <MovieDetailsContent movieId={resolvedParams.id} />
    </Suspense>
  );
}
