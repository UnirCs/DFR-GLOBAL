'use client';

// Client Component - Wrapper que aplica el tema oscuro/claro a las páginas
// Necesita ser client porque accede al contexto global para obtener darkMode

import { useMovies } from '@/hooks/useMovies';
import styles from './PageContainer.module.css';

const PageContainer = ({ children, className = '' }) => {
  const { darkMode } = useMovies();

  return (
    <div className={`${styles.pageContainer} ${className} ${darkMode ? styles.dark : ''}`}>
      {children}
    </div>
  );
};

export default PageContainer;
