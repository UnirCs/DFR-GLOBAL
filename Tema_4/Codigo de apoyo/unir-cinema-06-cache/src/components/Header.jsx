'use client';

import { useContext, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import clsx from 'clsx';
import { AuthContext } from '@/context/AuthContext';
import { GlobalContext } from '@/context/GlobalContext';
import { invalidateAllCache } from '@/lib/actions';

const Header = () => {
  const { user, setUser } = useContext(AuthContext);
  const { city, changeCity } = useContext(GlobalContext);
  const router = useRouter();
  const pathname = usePathname();
  const [isInvalidating, setIsInvalidating] = useState(false);

  const cities = [
    { value: 'madrid', label: 'Madrid' },
    { value: 'barcelona', label: 'Barcelona' },
    { value: 'valencia', label: 'Valencia' },
    { value: 'sevilla', label: 'Sevilla' }
  ];

  const handleCityChange = (e) => {
    const newCity = e.target.value;
    changeCity(newCity);
    // Si estamos en la cartelera, navegar a la nueva ciudad
    if (pathname.startsWith('/cartelera/')) {
      router.push(`/cartelera/${newCity}`);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleInvalidateCache = async () => {
    setIsInvalidating(true);
    try {
      const result = await invalidateAllCache();
      console.log('[CLIENT] Cache invalidada:', result.timestamp);
    } catch (error) {
      console.error('[CLIENT] Error al invalidar cache:', error);
    } finally {
      setIsInvalidating(false);
    }
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
        </Link>

        {/* Selector de ciudad */}
        <div className="flex items-center gap-2">
          <label htmlFor="header-city-select" className="text-cinema-gold font-medium text-sm">
            🎬 Ciudad:
          </label>
          <select
            id="header-city-select"
            value={city}
            onChange={handleCityChange}
            className={clsx(
              'px-3 py-2 rounded-lg text-sm',
              'border-2 border-cinema-border bg-cinema-dark-elevated text-cinema-text',
              'cursor-pointer transition-all duration-300',
              'hover:border-cinema-gold',
              'focus:border-cinema-gold focus:outline-none focus:ring-2 focus:ring-cinema-gold/20'
            )}
          >
            {cities.map((cityOption) => (
              <option key={cityOption.value} value={cityOption.value} className="bg-cinema-dark-elevated">
                {cityOption.label}
              </option>
            ))}
          </select>
        </div>

        {/* Navegación */}
        <nav className="flex gap-2 items-center">
          <Link href={`/cartelera/${city}`} className={navLinkClasses}>
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
          <button
            onClick={handleInvalidateCache}
            disabled={isInvalidating}
            className={clsx(
              'bg-gradient-to-r from-orange-500 to-red-600',
              'text-white px-4 py-2 rounded-lg font-bold text-sm',
              'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/50',
              'transition-all duration-300',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
            )}
          >
            {isInvalidating ? '⏳ Invalidando...' : '🗑️ Invalidar Cache'}
          </button>
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
