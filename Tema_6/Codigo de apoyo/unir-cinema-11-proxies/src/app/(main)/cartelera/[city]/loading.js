// Loading component para la página de cartelera
// Muestra tarjetas skeleton con efecto shimmer mientras se cargan las películas

export default function Loading() {
  // Simulamos varias tarjetas de película skeleton
  const skeletonCards = Array.from({ length: 4 }, (_, i) => i);

  return (
    <div className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-10 w-64 bg-cinema-dark-elevated rounded-lg mb-4 animate-pulse" />
        <div className="h-12 w-full max-w-md bg-cinema-dark-elevated rounded-lg animate-pulse" />
      </div>

      {/* Movie cards skeleton */}
      <div className="space-y-8">
        {skeletonCards.map((index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-gradient-to-br from-cinema-dark-card to-cinema-dark-elevated p-6 md:p-8 rounded-2xl shadow-lg shadow-black/50 border border-cinema-border flex flex-col md:flex-row gap-6 md:gap-8 overflow-hidden relative">
      {/* Efecto shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      {/* Poster skeleton */}
      <div className="relative w-full md:w-[200px] md:min-w-[200px] h-[280px] md:h-[300px] rounded-xl overflow-hidden bg-cinema-dark-elevated animate-pulse flex-shrink-0">
        {/* Badge skeleton */}
        <div className="absolute top-2 left-2 w-12 h-6 bg-cinema-border/50 rounded-md" />
        {/* Rating skeleton */}
        <div className="absolute bottom-3 right-3 w-16 h-7 bg-cinema-gold/20 rounded-full" />
      </div>

      {/* Content skeleton */}
      <div className="flex-1 flex flex-col">
        {/* Title skeleton */}
        <div className="h-8 w-3/4 bg-cinema-gold/20 rounded-lg mb-4 animate-pulse" />

        {/* Info lines skeleton */}
        <div className="space-y-3">
          <div className="h-4 w-32 bg-cinema-dark-elevated rounded animate-pulse" />
          <div className="h-4 w-40 bg-cinema-dark-elevated rounded animate-pulse" />
          <div className="h-4 w-36 bg-cinema-dark-elevated rounded animate-pulse" />
          <div className="h-4 w-24 bg-cinema-dark-elevated rounded animate-pulse" />
          <div className="h-4 w-full bg-cinema-dark-elevated rounded animate-pulse" />
          <div className="h-4 w-4/5 bg-cinema-dark-elevated rounded animate-pulse" />
        </div>

        {/* Sessions skeleton */}
        <div className="mt-4 pt-4 border-t border-cinema-border">
          <div className="h-5 w-40 bg-cinema-dark-elevated rounded animate-pulse mb-3" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-10 w-20 bg-cinema-red/20 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

