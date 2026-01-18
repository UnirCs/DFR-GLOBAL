'use client';

// Hook personalizado - Debe ser usado solo en Client Components
// - Accede al contexto global (GlobalContext)
// - Proporciona funciones y datos relacionados con películas y ciudades
// - El tema oscuro es ahora permanente, no requiere toggle

import { useContext } from 'react';
import { GlobalContext } from '@/context/GlobalContext';
import { moviesDataMadrid } from '@/data/moviesDataMadrid';
import { moviesDataBarcelona } from '@/data/moviesDataBarcelona';
import { moviesDataValencia } from '@/data/moviesDataValencia';
import { moviesDataSevilla } from '@/data/moviesDataSevilla';

export const useMovies = () => {
  const { city, changeCity } = useContext(GlobalContext);

  const citiesData = {
    madrid: {
      name: 'Madrid',
      movies: moviesDataMadrid
    },
    barcelona: {
      name: 'Barcelona',
      movies: moviesDataBarcelona
    },
    valencia: {
      name: 'Valencia',
      movies: moviesDataValencia
    },
    sevilla: {
      name: 'Sevilla',
      movies: moviesDataSevilla
    }
  };

  const getMoviesByCity = (cityName) => {
    switch (cityName) {
      case 'madrid':
        return moviesDataMadrid;
      case 'barcelona':
        return moviesDataBarcelona;
      case 'valencia':
        return moviesDataValencia;
      case 'sevilla':
        return moviesDataSevilla;
      default:
        return moviesDataMadrid;
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

  const getMovieById = (id) => {
    const allMovies = [
      ...moviesDataMadrid,
      ...moviesDataBarcelona,
      ...moviesDataValencia,
      ...moviesDataSevilla
    ];
    return allMovies.find(movie => movie.id === parseInt(id));
  };

  return {
    city,
    changeCity,
    movies: getMoviesByCity(city),
    citiesData,
    getCurrentCityName,
    getMovieById
  };
};
