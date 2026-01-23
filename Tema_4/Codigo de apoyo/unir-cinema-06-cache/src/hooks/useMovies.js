'use client';

// Hook personalizado - Debe ser usado solo en Client Components
// - Accede al contexto global (GlobalContext)
// - Proporciona funciones y datos relacionados con películas y ciudades
// - El tema oscuro es ahora permanente, no requiere toggle

import { useContext } from 'react';
import { GlobalContext } from '@/context/GlobalContext';

export const useMovies = () => {
  const { city, changeCity } = useContext(GlobalContext);

  // Datos estáticos de ciudades (la información de películas viene de la API)
  const citiesData = {
    madrid: {
      name: 'Madrid',
      movies: [] // Las películas se obtienen de la API
    },
    barcelona: {
      name: 'Barcelona',
      movies: []
    },
    valencia: {
      name: 'Valencia',
      movies: []
    },
    sevilla: {
      name: 'Sevilla',
      movies: []
    }
  };

  const getCurrentCityName = () => {
    switch (city) {
      case 'madrid':
        return 'Madrid';
      case 'barcelona':
        return 'Barcelona';
      case 'valencia':
        return 'Valencia';
      case 'sevilla':
        return 'Sevilla';
      default:
        return 'Madrid';
    }
  };

  return {
    city,
    changeCity,
    citiesData,
    getCurrentCityName,
    darkMode: true // Tema oscuro permanente
  };
};
