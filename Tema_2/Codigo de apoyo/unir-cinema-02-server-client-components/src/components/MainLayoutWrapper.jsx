'use client';

// Client Component - Wrapper para aplicar el modo oscuro/claro al layout principal
// Necesita ser client porque accede al contexto global para obtener darkMode

import { useMovies } from '@/hooks/useMovies';

const MainLayoutWrapper = ({ children }) => {
  const { darkMode } = useMovies();

  return (
    <div className={`App ${darkMode ? 'dark' : ''}`}>
      {children}
    </div>
  );
};

export default MainLayoutWrapper;

