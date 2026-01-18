'use client';

// Client Component - Página principal:
// - Accede al contexto global para obtener películas según la ciudad seleccionada
// - Renderiza componentes interactivos (CineSelector, Pelicula)

import CineSelector from '@/components/CineSelector';
import Pelicula from '@/components/Pelicula';
import { useMovies } from '@/hooks/useMovies';
export default function HomePage() {
  const { movies, darkMode } = useMovies();
  return (
    <div className={`home-page ${darkMode ? 'dark' : ''}`}>
      <CineSelector />
      {movies.map((movie) => (
        <Pelicula key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
