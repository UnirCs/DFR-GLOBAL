'use client';
import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="page-container">
      <div className="not-found-container">
        <h1>404</h1>
        <h2>Página no encontrada</h2>
        <p>
          Lo sentimos, la página que buscas no existe en UNIR Cinema.
        </p>
        <Link href="/" className="nav-button">
          🎬 Volver al inicio
        </Link>
      </div>
    </div>
  );
}
