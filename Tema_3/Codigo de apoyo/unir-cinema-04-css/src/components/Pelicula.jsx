'use client';

// Client Component - Requiere interactividad:
// - Acceso al contexto global para el tema oscuro/claro
// - Podría extenderse con funcionalidades interactivas (favoritos, compartir, etc.)

import Link from 'next/link';
import Image from 'next/image';
import { useMovies } from '@/hooks/useMovies';
import styles from './Pelicula.module.css';

const Pelicula = ({ movie, priority = false }) => {
  const { darkMode } = useMovies();

  return (
    <div className={`${styles.movie} ${darkMode ? styles.dark : ''}`}>
      <div className={styles.moviePosterContainer}>
        <Image
          src="/film-poster.jpg"
          alt={`Poster de ${movie.title}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className={styles.movieContent}>
        <h2 className={styles.title}>{movie.title}</h2>
        <p className={styles.info}><span className={styles.label}>Género:</span> {movie.genre}</p>
        <p className={styles.info}><span className={styles.label}>Duración:</span> {movie.duration}</p>
        <p className={styles.info}><span className={styles.label}>Clasificación:</span> {movie.rating}</p>
        <p className={styles.info}><span className={styles.label}>Director:</span> {movie.director}</p>
        <p className={styles.info}><span className={styles.label}>Año:</span> {movie.year}</p>
        <p className={styles.info}><span className={styles.label}>Sinopsis:</span> {movie.synopsis}</p>

        <div className={styles.sessions}>
          {movie.showtimes?.map((time, index) => (
            <Link
              key={index}
              href={`/movie/${movie.id}/session/${time}`}
              className={styles.sessionLink}
            >
              {time}
            </Link>
          ))}
        </div>

        <Link href={`/movie/${movie.id}`} className={styles.navButton}>
          Ver más detalles
        </Link>
      </div>
    </div>
  );
};

export default Pelicula;
