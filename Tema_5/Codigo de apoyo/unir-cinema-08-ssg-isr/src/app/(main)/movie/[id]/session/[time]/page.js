// Server Component - Página de selección de asientos
// Carga los datos de la película en el servidor (aprovecha cache)
// y los pasa al componente cliente para la interactividad

import { notFound } from 'next/navigation';
import { getMovieDetails } from '@/lib/api';
import SeatSelectionClient from './SeatSelectionClient';


export default async function SessionPage({ params }) {
  const { id, time } = await params;

  // Obtener datos de la película (usa cache del servidor)
  const movie = await getMovieDetails(id);

  if (!movie) {
    notFound();
  }

  return <SeatSelectionClient movie={movie} time={time} />;
}

