'use client';

// Client Component - Página principal:
// - Accede al contexto global para obtener películas según la ciudad seleccionada
// - Renderiza componentes interactivos (CineSelector, Pelicula)

import CineSelector from '@/components/CineSelector';
import Pelicula from '@/components/Pelicula';
import { useMovies } from '@/hooks/useMovies';
import styles from './HomePage.module.css';

export default function HomePage() {
  const { movies, darkMode } = useMovies();
  return (
    <div className={`${styles.homePage} ${darkMode ? styles.dark : ''}`}>
      <CineSelector />
      {movies.map((movie, index) => (
        <Pelicula key={movie.id} movie={movie} priority={index < 2} />
      ))}
    </div>
  );
}
