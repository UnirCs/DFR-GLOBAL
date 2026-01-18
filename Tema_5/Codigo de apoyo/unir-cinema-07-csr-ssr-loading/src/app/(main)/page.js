// Server Component - Página principal
// Redirige a la cartelera de Madrid por defecto
// La ciudad se maneja via URL params para permitir cache en Server Components

import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirigir a la cartelera de la ciudad por defecto
  redirect('/cartelera/madrid');
}
