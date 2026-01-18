'use client';

import Link from 'next/link';
import clsx from 'clsx';

export default function NotFound() {
  return (
    <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className={clsx(
          'text-8xl font-black',
          'bg-gradient-to-r from-cinema-red to-cinema-red-dark bg-clip-text text-transparent',
          'drop-shadow-[0_0_30px_rgba(220,20,60,0.5)] mb-4'
        )}>
          404
        </h1>
        <h2 className="text-cinema-gold text-2xl font-bold mb-4">Página no encontrada</h2>
        <p className="text-cinema-text-muted text-lg mb-8">
          Lo sentimos, la página que buscas no existe en UNIR Cinema.
        </p>
        <Link
          href="/Tema_5/Codigo%20de%20apoyo/unir-cinema-08-ssg-isr/public"
          className={clsx(
            'bg-gradient-to-r from-cinema-gold to-cinema-gold-dark',
            'text-cinema-dark px-8 py-3 rounded-lg font-bold text-lg',
            'hover:-translate-y-1 hover:shadow-xl hover:shadow-cinema-gold/50 hover:brightness-110',
            'transition-all duration-300'
          )}
        >
          🎬 Volver al inicio
        </Link>
      </div>
    </div>
  );
}
