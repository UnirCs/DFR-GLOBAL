'use client';

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

