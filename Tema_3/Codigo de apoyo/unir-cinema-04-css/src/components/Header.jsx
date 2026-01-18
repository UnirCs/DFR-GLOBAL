'use client';

// Client Component - Requiere interactividad:
// - Acceso al contexto de autenticación (AuthContext)
// - Acceso al contexto global (GlobalContext via useMovies)
// - Eventos onClick para logout y toggle de modo oscuro

import { useContext } from 'react';
import Link from 'next/link';
import { AuthContext } from '@/context/AuthContext';
import { useMovies } from '@/hooks/useMovies';
import styles from './Header.module.css';

const Header = () => {
  const { user, setUser } = useContext(AuthContext);
  const { getCurrentCityName, darkMode, toggleDarkMode } = useMovies();

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <header className={`${styles.header} ${darkMode ? styles.dark : ''}`}>
      <div className={styles.headerContent}>
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1 className={styles.title}>🎬 UNIR Cinema - {getCurrentCityName()}</h1>
        </Link>

        <nav className={styles.headerNav}>
          <Link href="/" className={styles.navLink}>Inicio</Link>
          <Link href="/about" className={styles.navLink}>Nosotros</Link>
          {user && user.role === 'admin' && (
            <Link href="/admin" className={styles.navLink}>Admin</Link>
          )}
        </nav>

        <div className={styles.headerControls}>
          <button className={styles.darkModeToggle} onClick={toggleDarkMode}>
            {darkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
          </button>

          {user ? (
            <>
              <span className={styles.userGreeting}>
                Hola, {user.name}
              </span>
              <button
                onClick={handleLogout}
                className={`${styles.authButton} ${styles.authButtonLogout}`}
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <Link href="/login" className={styles.authButton}>
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
