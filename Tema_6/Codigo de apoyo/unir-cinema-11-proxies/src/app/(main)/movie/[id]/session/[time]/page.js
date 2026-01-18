// Server Component - Pagina de seleccion de asientos
// Carga los datos de la pelicula en el servidor (aprovecha cache)
// y los pasa al componente cliente para la interactividad

import { notFound } from 'next/navigation';
import { getMovieDetailsFromStore } from '@/lib/api-server';
import SeatSelectionClient from './SeatSelectionClient';

// Requerido para usar pg (PostgreSQL)
export const runtime = "nodejs";


export default async function SessionPage({ params }) {
  const { id, time } = await params;

  // Acceso directo a la base de datos (mas eficiente que fetch)
  const movie = await getMovieDetailsFromStore(id);

  if (!movie) {
    notFound();
  }

  return <SeatSelectionClient movie={movie} time={time} />;
}

