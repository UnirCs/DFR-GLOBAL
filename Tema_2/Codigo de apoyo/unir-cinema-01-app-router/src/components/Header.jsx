'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { AuthContext } from '@/context/AuthContext';
import { useMovies } from '@/hooks/useMovies';

const Header = () => {
  const { user, setUser } = useContext(AuthContext);
  const { getCurrentCityName, darkMode, toggleDarkMode } = useMovies();

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <header className={darkMode ? 'dark' : ''}>
      <div className="header-content">
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1>🎬 UNIR Cinema - {getCurrentCityName()}</h1>
        </Link>

        <nav className="header-nav">
          <Link href="/" className="nav-link">Inicio</Link>
          <Link href="/about" className="nav-link">Nosotros</Link>
          {user && user.role === 'admin' && (
            <Link href="/admin" className="nav-link">Admin</Link>
          )}
        </nav>

        <div className="header-controls">
          <button className="dark-mode-toggle" onClick={toggleDarkMode}>
            {darkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
          </button>

          {user ? (
            <>
              <span className="user-greeting">
                Hola, {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="auth-button logout"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <Link href="/login" className="auth-button">
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

