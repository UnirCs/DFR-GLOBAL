'use client';

// Client Component - Página de detalles de película:
// - useRouter para navegación programática (botón volver)
// - useSearchParams para obtener parámetros de URL
// - Accede al contexto global para obtener datos de película y modo oscuro

import { use, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useMovies } from '@/hooks/useMovies';

function MovieDetailsContent({ movieId }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getMovieById, darkMode } = useMovies();

  const movie = getMovieById(movieId);
  const selectedDate = searchParams.get('date');

  // Si no se encuentra la película, mostrar el not-found del grupo
  if (!movie) {
    notFound();
  }

  return (
    <div className={`page-container ${darkMode ? 'dark' : ''}`}>
      <div className="movie-details">
        <button
          onClick={() => router.back()}
          className="nav-button"
          style={{ marginBottom: '2rem' }}
        >
          ← Volver
        </button>

        <div className="movie-detail-header">
          <div className="movie-detail-poster">
            <Image
              src="/film-poster.jpg"
              alt={`Poster de ${movie.title}`}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              priority
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="movie-detail-info">
            <h1>{movie.title}</h1>

            <div className="movie-info-grid">
              <div className="info-item">
                <strong>Género</strong><br/>
                {movie.genre}
              </div>
              <div className="info-item">
                <strong>Duración</strong><br/>
                {movie.duration}
              </div>
              <div className="info-item">
                <strong>Valoración</strong><br/>
                ⭐ {movie.rating}
              </div>
              <div className="info-item">
                <strong>Año</strong><br/>
                {movie.year}
              </div>
              <div className="info-item">
                <strong>Director</strong><br/>
                {movie.director}
              </div>
            </div>
          </div>
        </div>

        <div style={{ margin: '2rem 0' }}>
          <h3>Reparto:</h3>
          <p>{movie.cast.join(', ')}</p>
        </div>

        <div style={{ margin: '2rem 0' }}>
          <h3>Sinopsis:</h3>
          <p>{movie.synopsis}</p>
        </div>

        {selectedDate && (
          <div style={{ margin: '2rem 0', padding: '1rem', backgroundColor: darkMode ? '#2a2a2a' : '#f0f0f0', borderRadius: '8px' }}>
            <p><strong>Fecha seleccionada:</strong> {selectedDate}</p>
          </div>
        )}

        <div className="sessions">
          <h3>Seleccionar horario:</h3>
          {movie.showtimes.map((time, index) => (
            <Link
              key={index}
              href={`/movie/${movie.id}/session/${time}`}
            >
              {time}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MovieDetailsPage({ params }) {
  const resolvedParams = use(params);

  return (
    <Suspense fallback={<div className="page-container"><p>Cargando...</p></div>}>
      <MovieDetailsContent movieId={resolvedParams.id} />
    </Suspense>
  );
}
