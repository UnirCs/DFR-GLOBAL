'use client';

// Client Component - Requiere interactividad:
// - Acceso al contexto global para el tema oscuro/claro
// - Podría extenderse con funcionalidades interactivas (favoritos, compartir, etc.)

import Link from 'next/link';
import Image from 'next/image';
import { useMovies } from '@/hooks/useMovies';

const Pelicula = ({ movie, priority = false }) => {
  const { darkMode } = useMovies();

  return (
    <div className={`movie ${darkMode ? 'dark' : ''}`}>
      <div className="movie-poster-container">
        <Image
          src="/film-poster.jpg"
          alt={`Poster de ${movie.title}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="movie-content">
        <h2>{movie.title}</h2>
        <p><strong>Género:</strong> {movie.genre}</p>
        <p><strong>Duración:</strong> {movie.duration}</p>
        <p><strong>Clasificación:</strong> {movie.rating}</p>
        <p><strong>Director:</strong> {movie.director}</p>
        <p><strong>Año:</strong> {movie.year}</p>
        <p><strong>Sinopsis:</strong> {movie.synopsis}</p>

        <div className="sessions">
          {movie.showtimes?.map((time, index) => (
            <Link
              key={index}
              href={`/movie/${movie.id}/session/${time}`}
            >
              {time}
            </Link>
          ))}
        </div>

        <Link href={`/movie/${movie.id}`} className="nav-button">
          Ver más detalles
        </Link>
      </div>
    </div>
  );
};

export default Pelicula;

