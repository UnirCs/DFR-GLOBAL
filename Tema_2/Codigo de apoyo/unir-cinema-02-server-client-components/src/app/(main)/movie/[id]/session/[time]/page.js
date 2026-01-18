'use client';

// Client Component - Página de selección de asientos:
// - Requiere PrivateRoute (client) para proteger acceso
// - SeatSelection es un componente interactivo complejo

import { use } from 'react';
import PrivateRoute from '@/components/PrivateRoute';
import SeatSelection from '@/components/SeatSelection';

export default function SessionPage({ params }) {
  const resolvedParams = use(params);

  return (
    <PrivateRoute>
      <SeatSelection movieId={resolvedParams.id} time={resolvedParams.time} />
    </PrivateRoute>
  );
}

