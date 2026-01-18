// Server Component - Pagina de seleccion de asientos
// Carga los datos de la pelicula en el servidor (aprovecha cache)
// y los pasa al componente cliente para la interactividad

import { notFound } from 'next/navigation';
import { getMovieDetailsFromStore, getScreeningFromStore } from '@/lib/api-server';
import SeatSelectionClient from './SeatSelectionClient';

// Requerido para usar pg (PostgreSQL)
export const runtime = "nodejs";

// Ciudad por defecto
const DEFAULT_CITY = 'Madrid';


export default async function SessionPage({ params, searchParams }) {
  const { id, time } = await params;
  const { city = DEFAULT_CITY } = await searchParams;
  const decodedTime = decodeURIComponent(time);

  // Acceso directo a la base de datos (mas eficiente que fetch)
  const movie = await getMovieDetailsFromStore(id);

  if (!movie) {
    notFound();
  }

  // Obtener datos del screening para tener el ID correcto
  const screening = await getScreeningFromStore(id, city, decodedTime);

  return (
    <SeatSelectionClient
      movie={movie}
      time={time}
      screeningId={screening?.id || null}
      screeningPrice={screening?.basePrice || 12}
    />
  );
}

