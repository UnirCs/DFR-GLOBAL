// Server Component - Landing Page Principal
//
// ISR (Incremental Static Regeneration) REAL:
// - Esta página se genera estáticamente en build time
// - Se REGENERA automáticamente cada 15 segundos (export const revalidate)
// - El HTML completo se regenera, no solo los datos
// - Los archivos se almacenan en .next/server/app/(main)/
//
// DIFERENCIA con cache de datos:
// - getMetrics(): Se regenera con la página (ISR real - cada 15s)
// - getTopMovies(): Tiene su propio cache de 30s (cache de datos independiente)

import Image from 'next/image';
import Link from 'next/link';
import { getCinemasFromStore, getMetricsFromStore, getTopMoviesFromStore } from '@/lib/api-server';

// ISR REAL: Regenera toda la página cada 15 segundos
// Nota: Durante el build usamos funciones que acceden directamente al store
// porque las URLs relativas no funcionan sin servidor corriendo
export const revalidate = 15;


// Información adicional de cada ciudad para la landing
const cityInfo = {
  madrid: {
    emoji: '🏛️',
    color: 'from-red-600 to-red-800',
    highlight: 'El más grande',
    screens: 15,
  },
  barcelona: {
    emoji: '🌊',
    color: 'from-blue-600 to-blue-800',
    highlight: 'Premium',
    screens: 12,
  },
  valencia: {
    emoji: '🍊',
    color: 'from-orange-500 to-orange-700',
    highlight: 'Céntrico',
    screens: 10,
  },
  sevilla: {
    emoji: '☀️',
    color: 'from-yellow-500 to-amber-600',
    highlight: 'Con encanto',
    screens: 8,
  },
};

export default async function HomePage() {
  // Obtener datos directamente de la base de datos (sin fetch)
  // Esto funciona tanto en build time como en runtime
  const cinemas = await getCinemasFromStore();     // Lista de cines
  const metrics = await getMetricsFromStore();           // Metricas del sistema (estaticas)
  const topMovies = await getTopMoviesFromStore(); // Peliculas ordenadas por rating

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section con animaciones */}
      <section className="relative flex items-center justify-center px-4 py-12 overflow-hidden">
        {/* Fondo animado */}
        <div className="absolute inset-0 bg-gradient-to-b from-cinema-black via-cinema-dark to-cinema-black">
          {/* Partículas/estrellas animadas */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cinema-gold rounded-full animate-pulse" />
            <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
            <div className="absolute top-2/3 left-1/2 w-2 h-2 bg-cinema-red rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-cinema-gold rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
            <div className="absolute top-1/2 left-1/5 w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.7s' }} />
            <div className="absolute bottom-1/3 right-1/5 w-2 h-2 bg-cinema-red-light rounded-full animate-ping" style={{ animationDelay: '2s' }} />
          </div>
        </div>

        {/* Contenido principal */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Logo animado */}
          <div className="mb-6 animate-bounce" style={{ animationDuration: '3s' }}>
            <span className="text-6xl md:text-7xl">🎬</span>
          </div>

          {/* Título con gradiente */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cinema-gold via-cinema-gold-light to-cinema-gold bg-clip-text text-transparent">
              UNIR Cinema
            </span>
          </h1>

          {/* Slogan principal */}
          <p className="text-xl md:text-2xl text-cinema-text mb-3 font-light">
            Tu destino cinematográfico
          </p>

          {/* Mensaje gancho */}
          <div className="relative inline-block mb-8">
            <p className="text-base md:text-lg text-cinema-text-muted px-6 py-3 rounded-2xl bg-cinema-dark-card/50 backdrop-blur border border-cinema-border">
              ✨ Vive la magia del cine como nunca antes ✨
            </p>
          </div>

          {/* Grid de ciudades - 2x2 */}
          <div className="grid grid-cols-2 gap-4 md:gap-5 max-w-xl mx-auto">
            {cinemas.map((cinema) => {
              const cityKey = cinema.toLowerCase();
              const info = cityInfo[cityKey] || { emoji: '🎥', color: 'from-gray-600 to-gray-800', highlight: '', screens: 0 };

              return (
                <Link
                  key={cinema}
                  href={`/cartelera/${cityKey}`}
                  className="group relative overflow-hidden rounded-2xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-cinema-gold/20"
                >
                  {/* Fondo con gradiente */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-80 group-hover:opacity-100 transition-opacity duration-300`} />

                  {/* Efecto de brillo en hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>

                  {/* Contenido de la tarjeta */}
                  <div className="relative p-5 md:p-6">
                    <span className="text-3xl md:text-4xl mb-2 block transform group-hover:scale-110 transition-transform duration-300">
                      {info.emoji}
                    </span>
                    <h2 className="text-lg md:text-xl font-bold text-white mb-1">
                      {cinema}
                    </h2>
                    <div className="flex items-center justify-center gap-2 text-white/80 text-xs">
                      <span>🎥 {info.screens} salas</span>
                    </div>
                    {info.highlight && (
                      <span className="inline-block mt-2 px-2 py-0.5 bg-white/20 rounded-full text-xs text-white font-semibold">
                        {info.highlight}
                      </span>
                    )}

                    {/* Flecha indicadora */}
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <span className="text-white text-xl">→</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Texto adicional */}
          <p className="mt-8 text-cinema-text-muted text-sm">
            🍿 Selecciona tu ciudad y descubre la cartelera
          </p>
        </div>
      </section>

      {/* Sección de Métricas en tiempo real - ISR cada 15s */}
      <section className="bg-cinema-dark-secondary py-10 px-4 border-y border-cinema-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-cinema-gold mb-2">
              📊 UNIR Cinema en números
            </h2>
            <p className="text-cinema-text-muted text-sm">
              Datos actualizados automáticamente • ISR cada 15 segundos
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-cinema-dark-card rounded-xl p-4 text-center border border-cinema-border">
              <span className="text-2xl mb-1 block">🎟️</span>
              <strong className="text-cinema-gold text-2xl md:text-3xl font-bold">
                {metrics.ticketsSoldToday?.toLocaleString() ?? '---'}
              </strong>
              <p className="text-cinema-text-muted text-xs mt-1">Entradas hoy</p>
            </div>
            <div className="bg-cinema-dark-card rounded-xl p-4 text-center border border-cinema-border">
              <span className="text-2xl mb-1 block">📅</span>
              <strong className="text-cinema-gold text-2xl md:text-3xl font-bold">
                {metrics.ticketsSoldMonth?.toLocaleString() ?? '---'}
              </strong>
              <p className="text-cinema-text-muted text-xs mt-1">Entradas este mes</p>
            </div>
            <div className="bg-cinema-dark-card rounded-xl p-4 text-center border border-cinema-border">
              <span className="text-2xl mb-1 block">⏱️</span>
              <strong className="text-cinema-gold text-2xl md:text-3xl font-bold">
                {metrics.minutesWatchedYear ? `${(metrics.minutesWatchedYear / 1000000).toFixed(1)}M` : '---'}
              </strong>
              <p className="text-cinema-text-muted text-xs mt-1">Minutos visualizados</p>
            </div>
            <div className="bg-cinema-dark-card rounded-xl p-4 text-center border border-cinema-border">
              <span className="text-2xl mb-1 block">⭐</span>
              <strong className="text-cinema-gold text-2xl md:text-3xl font-bold">
                {metrics.averageRating?.toFixed(1) ?? '---'}
              </strong>
              <p className="text-cinema-text-muted text-xs mt-1">Valoración media</p>
            </div>
          </div>

          {/* Timestamp de última actualización */}
          <p className="text-center text-cinema-text-muted text-xs mt-4">
            Última regeneración: {new Date().toLocaleTimeString('es-ES')}
          </p>
        </div>
      </section>

      {/* Sección de Top Movies - Cache de datos 30s */}
      <section className="bg-cinema-dark py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-cinema-text mb-2">
              🏆 Películas más valoradas
            </h2>
            <p className="text-cinema-text-muted text-sm">
              Cache de datos independiente • Revalidación cada 30 segundos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topMovies.map((movie, index) => (
              <div
                key={movie.id}
                className="group bg-cinema-dark-card rounded-xl overflow-hidden border border-cinema-border hover:border-cinema-gold transition-all duration-300 hover:shadow-lg hover:shadow-cinema-gold/10"
              >
                {/* Imagen de la película */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={'/film-poster.jpg'}
                    alt={movie.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Badge de posición */}
                  <div className="absolute top-2 left-2 bg-cinema-gold text-cinema-black font-bold px-2 py-1 rounded-lg text-sm">
                    #{index + 1}
                  </div>
                  {/* Rating */}
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-lg text-sm flex items-center gap-1">
                    <span>⭐</span>
                    <span>{movie.rating?.toFixed(1)}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-cinema-text font-bold text-lg mb-1 truncate">
                    {movie.title}
                  </h3>
                  <p className="text-cinema-text-muted text-sm">
                    {movie.genre} • {movie.duration}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de características */}
      <section className="bg-cinema-dark-secondary py-10 px-4 border-t border-cinema-border">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3">
              <span className="text-2xl mb-1 block">🎬</span>
              <h3 className="text-cinema-gold font-bold text-sm">+4 Cines</h3>
              <p className="text-cinema-text-muted text-xs">En toda España</p>
            </div>
            <div className="p-3">
              <span className="text-2xl mb-1 block">🎥</span>
              <h3 className="text-cinema-gold font-bold text-sm">+45 Salas</h3>
              <p className="text-cinema-text-muted text-xs">Última tecnología</p>
            </div>
            <div className="p-3">
              <span className="text-2xl mb-1 block">🔊</span>
              <h3 className="text-cinema-gold font-bold text-sm">Dolby Atmos</h3>
              <p className="text-cinema-text-muted text-xs">Sonido inmersivo</p>
            </div>
            <div className="p-3">
              <span className="text-2xl mb-1 block">👑</span>
              <h3 className="text-cinema-gold font-bold text-sm">Salas VIP</h3>
              <p className="text-cinema-text-muted text-xs">Experiencia premium</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
