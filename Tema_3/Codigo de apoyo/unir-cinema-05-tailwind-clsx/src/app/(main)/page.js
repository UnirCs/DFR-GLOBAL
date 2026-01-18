'use client';

// Client Component - Página principal:
// - Accede al contexto global para obtener películas según la ciudad seleccionada
// - Renderiza componentes interactivos (CineSelector, Pelicula)
// - Tema oscuro de cine permanente

import CineSelector from '@/components/CineSelector';
import Pelicula from '@/components/Pelicula';
import { useMovies } from '@/hooks/useMovies';

export default function HomePage() {
  const { movies } = useMovies();

  return (
    <div className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
      <CineSelector />
      {movies.map((movie, index) => (
        <Pelicula key={movie.id} movie={movie} priority={index < 2} />
      ))}
    </div>
  );
}
