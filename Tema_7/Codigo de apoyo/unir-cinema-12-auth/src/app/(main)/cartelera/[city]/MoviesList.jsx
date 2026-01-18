// Server Component - Lista de películas
// Recibe las películas ya cargadas desde el Server Component padre
// No necesita 'use client' porque no tiene interactividad

import Pelicula from '@/components/Pelicula';

export default function MoviesList({ movies, city }) {
  return (
    <div>
      {movies.map((movie, index) => (
        <Pelicula key={`${movie.id}-${index}`} movie={movie} city={city} priority={index < 2} />
      ))}
    </div>
  );
}

