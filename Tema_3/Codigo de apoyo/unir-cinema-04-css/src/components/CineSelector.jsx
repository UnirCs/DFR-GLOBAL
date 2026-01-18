'use client';

// Client Component - Requiere interactividad:
// - Acceso al contexto global (GlobalContext via useMovies) para cambiar ciudad
// - Eventos onChange en el select para actualizar el estado global

import { useMovies } from '@/hooks/useMovies';
import styles from './CineSelector.module.css';

const CineSelector = () => {
  const { city, changeCity, darkMode } = useMovies();

  const cities = [
    { value: 'madrid', label: 'Madrid' },
    { value: 'barcelona', label: 'Barcelona' },
    { value: 'valencia', label: 'Valencia' },
    { value: 'sevilla', label: 'Sevilla' }
  ];

  return (
    <div className={`${styles.cineSelector} ${darkMode ? styles.dark : ''}`}>
      <label htmlFor="city-select" className={styles.label}>
        Selecciona tu ciudad:
      </label>
      <select
        id="city-select"
        value={city}
        onChange={(e) => changeCity(e.target.value)}
        className={styles.select}
      >
        {cities.map((cityOption) => (
          <option key={cityOption.value} value={cityOption.value}>
            {cityOption.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CineSelector;
