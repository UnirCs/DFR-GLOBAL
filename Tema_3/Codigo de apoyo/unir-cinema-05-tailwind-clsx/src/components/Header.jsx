'use client';

import { useContext } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { AuthContext } from '@/context/AuthContext';
import { useMovies } from '@/hooks/useMovies';

const Header = () => {
  const { user, setUser } = useContext(AuthContext);
  const { getCurrentCityName } = useMovies();

  const handleLogout = () => {
    setUser(null);
  };

  // Clases reutilizables para los enlaces de navegación
  const navLinkClasses = clsx(
    'text-cinema-text px-4 py-2 rounded-lg bg-white/5',
    'border border-transparent',
    'hover:border-cinema-gold hover:text-cinema-gold hover:-translate-y-0.5',
    'transition-all duration-300 font-medium'
  );

  return (
    <header className={clsx(
      'bg-gradient-to-r from-cinema-dark-secondary via-cinema-dark-elevated to-cinema-dark-secondary',
      'border-b-2 border-cinema-red px-6 py-4',
      'sticky top-0 z-50',
      'shadow-lg shadow-black/50'
    )}>
      <div className="flex flex-wrap justify-between items-center max-w-7xl mx-auto gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <span className="text-3xl drop-shadow-[0_0_8px_rgba(220,20,60,0.5)]">🎬</span>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cinema-gold via-cinema-gold-light to-cinema-gold bg-clip-text text-transparent">
            UNIR Cinema
          </h1>
          <span className={clsx(
            'text-sm font-semibold px-3 py-1',
            'bg-gradient-to-r from-cinema-red to-cinema-red-dark',
            'rounded-full text-white',
            'shadow-lg shadow-cinema-red/30'
          )}>
            {getCurrentCityName()}
          </span>
        </Link>

        {/* Navegación */}
        <nav className="flex gap-2 items-center">
          <Link href="/" className={navLinkClasses}>
            Inicio
          </Link>
          <Link href="/about" className={navLinkClasses}>
            Nosotros
          </Link>
          {user && user.role === 'admin' && (
            <Link href="/admin" className={navLinkClasses}>
              Admin
            </Link>
          )}
        </nav>

        {/* Controles de usuario */}
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <span className="text-cinema-text-muted font-medium text-sm">
                Hola, {user.name}
              </span>
              <button
                onClick={handleLogout}
                className={clsx(
                  'bg-gradient-to-r from-cinema-red to-cinema-red-dark',
                  'text-white px-5 py-2 rounded-lg font-bold',
                  'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cinema-red/50',
                  'transition-all duration-300'
                )}
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className={clsx(
                'bg-gradient-to-r from-cinema-gold to-cinema-gold-dark',
                'text-cinema-dark px-5 py-2 rounded-lg font-bold',
                'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cinema-gold/50 hover:brightness-110',
                'transition-all duration-300'
              )}
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
