'use client';

// Client Component - Sincroniza la ciudad de la URL con el contexto global
// Se ejecuta cuando la URL cambia para mantener el selector del Header actualizado

import { useContext, useEffect } from 'react';
import { GlobalContext } from '@/context/GlobalContext';

export default function CitySyncClient({ city }) {
  const { changeCity } = useContext(GlobalContext);

  useEffect(() => {
    changeCity(city);
  }, [city, changeCity]);

  // Este componente no renderiza nada visible
  return null;
}

