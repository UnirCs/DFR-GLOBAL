// Server Component - Página de selección de asientos
// Carga los datos de la película en el servidor (aprovecha cache)
// y los pasa al componente cliente para la interactividad

import { notFound } from 'next/navigation';
import { getMovieDetailsFromStore } from '@/lib/api';
import SeatSelectionClient from './SeatSelectionClient';


export default async function SessionPage({ params }) {
  const { id, time } = await params;

  // Acceso directo al store (más eficiente que fetch)
  const movie = getMovieDetailsFromStore(id);

  if (!movie) {
    notFound();
  }

  return <SeatSelectionClient movie={movie} time={time} />;
}

