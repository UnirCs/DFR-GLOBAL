'use client';

// Client Component - Selector de ciudad con navegación
// Recibe datos del Server Component padre y maneja la navegación

import { useRouter } from 'next/navigation';
import clsx from 'clsx';

export default function CineSelectorServer({ currentCity, cities }) {
  const router = useRouter();

  const handleCityChange = (e) => {
    const newCity = e.target.value.toLowerCase();
    router.push(`/cartelera/${newCity}`);
  };

  return (
    <div className={clsx(
      'mb-10 bg-gradient-to-br from-cinema-dark-card to-cinema-dark-elevated',
      'p-6 rounded-xl shadow-lg shadow-black/40',
      'border border-cinema-border',
      'flex flex-wrap items-center gap-4'
    )}>
      <label htmlFor="city-select" className="font-semibold text-cinema-gold text-lg">
        🎬 Selecciona tu ciudad:
      </label>
      <select
        id="city-select"
        value={currentCity}
        onChange={handleCityChange}
        className={clsx(
          'flex-1 min-w-[200px] max-w-xs p-3 rounded-lg',
          'border-2 border-cinema-border bg-cinema-dark-elevated text-cinema-text',
          'cursor-pointer transition-all duration-300',
          'hover:border-cinema-gold',
          'focus:border-cinema-gold focus:outline-none focus:ring-2 focus:ring-cinema-gold/20'
        )}
      >
        {cities.map((city) => (
          <option
            key={city}
            value={city.toLowerCase()}
            className="bg-cinema-dark-elevated"
          >
            {city}
          </option>
        ))}
      </select>
    </div>
  );
}

