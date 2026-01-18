'use client';

// Client Component - Requiere interactividad:
// - Podría extenderse con funcionalidades interactivas (favoritos, compartir, etc.)
// - Tema oscuro de cine permanente
// - Uso de clsx para gestionar clases de Tailwind y CSS Modules
// - Utiliza SessionButton para los horarios con variantes de formato

import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import SessionButton from './SessionButton';

// Etiquetas de formato para mostrar en la tarjeta
const formatBadges = {
  standard: null,
  '3d': { label: '3D', color: 'bg-emerald-500' },
  hdfr: { label: 'HDFR', color: 'bg-violet-500' },
  imax: { label: 'IMAX', color: 'bg-cyan-500' },
};

const Pelicula = ({ movie, city, priority = false }) => {
  const format = movie.format?.toLowerCase() || 'standard';
  const badge = formatBadges[format];

  return (
    <div className={clsx(
      'bg-gradient-to-br from-cinema-dark-card to-cinema-dark-elevated',
      'p-6 md:p-8 mb-8 rounded-2xl shadow-lg shadow-black/50',
      'border border-cinema-border',
      'flex flex-col md:flex-row gap-6 md:gap-8',
      'transition-all duration-300',
      'hover:-translate-y-1 hover:shadow-xl hover:shadow-black/60 hover:border-cinema-red'
    )}>
      {/* Poster */}
      <div className="relative w-full md:w-[200px] md:min-w-[200px] h-[280px] md:h-[300px] rounded-xl overflow-hidden shadow-md flex-shrink-0">
        <Image
          src="/film-poster.jpg"
          alt={`Poster de ${movie.title}`}
          fill
          sizes="(max-width: 768px) 100vw, 200px"
          priority={priority}
          className="object-cover"
        />
        {/* Badge de formato en la esquina superior izquierda */}
        {badge && (
          <div className={clsx(
            'absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-bold text-white',
            badge.color
          )}>
            {badge.label}
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent flex justify-end">
          <span className={clsx(
            'bg-gradient-to-r from-cinema-gold to-cinema-gold-dark',
            'text-cinema-dark px-3 py-1 rounded-full font-bold text-sm',
            'shadow-lg shadow-cinema-gold/30'
          )}>
            ⭐ {movie.rating}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 flex flex-col">
        <h2 className="text-cinema-gold text-2xl font-bold mb-3 pb-2 border-b-2 border-cinema-red inline-block">
          {movie.title}
        </h2>

        <div className="space-y-1 text-cinema-text-muted text-sm">
          <p><span className="text-cinema-text font-semibold">Género:</span> {movie.genre}</p>
          <p><span className="text-cinema-text font-semibold">Duración:</span> {movie.duration}</p>
          <p><span className="text-cinema-text font-semibold">Director:</span> {movie.director}</p>
          <p><span className="text-cinema-text font-semibold">Año:</span> {movie.year}</p>
          <p className="line-clamp-2"><span className="text-cinema-text font-semibold">Sinopsis:</span> {movie.synopsis}</p>
        </div>

        {/* Sesiones */}
        <div className="mt-4 pt-4 border-t border-cinema-border">
          <h4 className="text-cinema-text font-semibold mb-3">🎟️ Horarios disponibles:</h4>
          <div className="flex flex-wrap gap-2">
            {movie.showtimes?.map((time, index) => (
              <SessionButton
                key={index}
                movieId={movie.id}
                time={time}
                format={movie.format}
              />
            ))}
          </div>
        </div>

        <Link
          href={`/movie/${movie.id}?city=${city}`}
          prefetch={false}
          className={clsx(
            'mt-4 self-start',
            'bg-gradient-to-r from-cinema-gold to-cinema-gold-dark',
            'text-cinema-dark px-5 py-2 rounded-lg font-bold',
            'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cinema-gold/50 hover:brightness-110',
            'transition-all duration-300'
          )}
        >
          Ver más detalles
        </Link>
      </div>
    </div>
  );
};

export default Pelicula;
