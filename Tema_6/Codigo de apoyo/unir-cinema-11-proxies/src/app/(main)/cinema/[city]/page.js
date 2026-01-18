// Server Component - Pagina de detalles de cine
//
// SSG (Static Site Generation) con generateStaticParams:
// - Esta pagina se genera estaticamente en build time
// - Los datos de los cines rara vez cambian, ideal para SSG
// - Se pre-generan todas las rutas: /cinema/madrid, /cinema/barcelona, etc.
// - Los archivos HTML estaticos se almacenan en .next/server/app/(main)/cinema/[city]

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCinemasFromStore } from '@/lib/api-server';

// Requerido para usar pg (PostgreSQL)
export const runtime = "nodejs";

// SSG: Pre-genera todas las rutas de cines en build time
// Usamos getCinemasFromStore (acceso directo) porque durante el build
// no hay servidor corriendo y las URLs relativas no funcionan.
export async function generateStaticParams() {
  const cinemas = await getCinemasFromStore();

  return cinemas.map((cinema) => ({
    city: cinema.toLowerCase(),
  }));
}


// Datos estáticos de los cines (información que rara vez cambia)
const cinemaInfo = {
  barcelona: {
    name: "Barcelona",
    address: "Passeig de Gràcia, 123, Barcelona",
    phone: "934 567 890",
    email: "barcelona@unircinema.es",
    screens: 12,
    capacity: 2500,
    parking: true,
    accessibility: true,
    vip: true,
    imax: true,
    dolbyAtmos: true,
    openingYear: 2015,
    description: "Nuestro cine de Barcelona está ubicado en pleno corazón del Passeig de Gràcia, ofreciendo una experiencia cinematográfica premium con las últimas tecnologías."
  },
  madrid: {
    name: "Madrid",
    address: "Gran Vía, 45, Madrid",
    phone: "915 678 901",
    email: "madrid@unircinema.es",
    screens: 15,
    capacity: 3000,
    parking: true,
    accessibility: true,
    vip: true,
    imax: true,
    dolbyAtmos: true,
    openingYear: 2012,
    description: "El buque insignia de UNIR Cinema en la emblemática Gran Vía madrileña. El cine más grande de nuestra cadena con las mejores instalaciones."
  },
  sevilla: {
    name: "Sevilla",
    address: "Calle Sierpes, 67, Sevilla",
    phone: "954 789 012",
    email: "sevilla@unircinema.es",
    screens: 8,
    capacity: 1800,
    parking: false,
    accessibility: true,
    vip: false,
    imax: false,
    dolbyAtmos: true,
    openingYear: 2018,
    description: "En el corazón del centro histórico de Sevilla, un cine con encanto andaluz y la mejor proyección digital."
  },
  valencia: {
    name: "Valencia",
    address: "Plaza del Ayuntamiento, 89, Valencia",
    phone: "963 890 123",
    email: "valencia@unircinema.es",
    screens: 10,
    capacity: 2200,
    parking: true,
    accessibility: true,
    vip: true,
    imax: false,
    dolbyAtmos: true,
    openingYear: 2016,
    description: "Junto a la Plaza del Ayuntamiento, nuestro cine valenciano combina tradición y modernidad para una experiencia única."
  }
};

export default async function CinemaDetailPage({ params }) {
  const { city } = await params;
  const info = cinemaInfo[city.toLowerCase()];

  // Si la ciudad no existe, mostrar not-found
  if (!info) {
    notFound();
  }

  return (
    <div className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
      {/* Navegación */}
      <div className="mb-8">
        <Link
          href={`/cartelera/${city}`}
          className="inline-flex items-center gap-2 text-cinema-gold hover:text-cinema-gold-light transition-colors"
        >
          ← Volver a la cartelera
        </Link>
      </div>

      {/* Header del cine */}
      <div className="bg-cinema-dark-card rounded-2xl p-8 mb-8 border border-cinema-border">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-5xl">🎬</span>
          <div>
            <h1 className="text-3xl font-bold text-cinema-gold">
              UNIR Cinema {info.name}
            </h1>
            <p className="text-cinema-text-muted">
              Desde {info.openingYear} ofreciendo la mejor experiencia cinematográfica
            </p>
          </div>
        </div>
        <p className="text-cinema-text mt-4 leading-relaxed">
          {info.description}
        </p>
      </div>

      {/* Grid de información */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-cinema-dark-elevated rounded-xl p-6 text-center border border-cinema-border">
          <span className="text-3xl mb-2 block">🎥</span>
          <strong className="text-cinema-gold text-2xl">{info.screens}</strong>
          <p className="text-cinema-text-muted text-sm">Salas</p>
        </div>
        <div className="bg-cinema-dark-elevated rounded-xl p-6 text-center border border-cinema-border">
          <span className="text-3xl mb-2 block">💺</span>
          <strong className="text-cinema-gold text-2xl">{info.capacity.toLocaleString()}</strong>
          <p className="text-cinema-text-muted text-sm">Butacas</p>
        </div>
        <div className="bg-cinema-dark-elevated rounded-xl p-6 text-center border border-cinema-border">
          <span className="text-3xl mb-2 block">🅿️</span>
          <strong className={`text-2xl ${info.parking ? 'text-green-500' : 'text-red-500'}`}>
            {info.parking ? 'Sí' : 'No'}
          </strong>
          <p className="text-cinema-text-muted text-sm">Parking</p>
        </div>
        <div className="bg-cinema-dark-elevated rounded-xl p-6 text-center border border-cinema-border">
          <span className="text-3xl mb-2 block">♿</span>
          <strong className={`text-2xl ${info.accessibility ? 'text-green-500' : 'text-red-500'}`}>
            {info.accessibility ? 'Sí' : 'No'}
          </strong>
          <p className="text-cinema-text-muted text-sm">Accesible</p>
        </div>
      </div>

      {/* Servicios premium */}
      <div className="bg-cinema-dark-card rounded-2xl p-8 mb-8 border border-cinema-border">
        <h2 className="text-xl font-bold text-cinema-text mb-6 flex items-center gap-2">
          ⭐ Servicios Premium
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`rounded-xl p-4 text-center ${info.vip ? 'bg-cinema-gold/20 border border-cinema-gold' : 'bg-cinema-dark-secondary border border-cinema-border opacity-50'}`}>
            <span className="text-2xl mb-2 block">👑</span>
            <strong className="text-cinema-text">Sala VIP</strong>
            <p className="text-cinema-text-muted text-sm mt-1">
              {info.vip ? 'Disponible' : 'No disponible'}
            </p>
          </div>
          <div className={`rounded-xl p-4 text-center ${info.imax ? 'bg-cinema-gold/20 border border-cinema-gold' : 'bg-cinema-dark-secondary border border-cinema-border opacity-50'}`}>
            <span className="text-2xl mb-2 block">📽️</span>
            <strong className="text-cinema-text">IMAX</strong>
            <p className="text-cinema-text-muted text-sm mt-1">
              {info.imax ? 'Disponible' : 'No disponible'}
            </p>
          </div>
          <div className={`rounded-xl p-4 text-center ${info.dolbyAtmos ? 'bg-cinema-gold/20 border border-cinema-gold' : 'bg-cinema-dark-secondary border border-cinema-border opacity-50'}`}>
            <span className="text-2xl mb-2 block">🔊</span>
            <strong className="text-cinema-text">Dolby Atmos</strong>
            <p className="text-cinema-text-muted text-sm mt-1">
              {info.dolbyAtmos ? 'Disponible' : 'No disponible'}
            </p>
          </div>
        </div>
      </div>

      {/* Información de contacto */}
      <div className="bg-cinema-dark-card rounded-2xl p-8 mb-8 border border-cinema-border">
        <h2 className="text-xl font-bold text-cinema-text mb-6 flex items-center gap-2">
          📞 Información de contacto
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-cinema-gold">📍</span>
              <div>
                <strong className="text-cinema-text">Dirección</strong>
                <p className="text-cinema-text-muted">{info.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-cinema-gold">📞</span>
              <div>
                <strong className="text-cinema-text">Teléfono</strong>
                <p className="text-cinema-text-muted">{info.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-cinema-gold">✉️</span>
              <div>
                <strong className="text-cinema-text">Email</strong>
                <p className="text-cinema-text-muted">{info.email}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-cinema-gold">🕐</span>
              <div>
                <strong className="text-cinema-text">Horario</strong>
                <p className="text-cinema-text-muted">Lunes a Domingo: 10:00 - 00:30</p>
                <p className="text-cinema-text-muted text-sm">Taquillas cierran 30 min antes de la última sesión</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-cinema-gold">🎟️</span>
              <div>
                <strong className="text-cinema-text">Venta online</strong>
                <p className="text-cinema-text-muted">Disponible 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="text-center">
        <Link
          href={`/cartelera/${city}`}
          className="inline-block bg-cinema-red hover:bg-cinema-red-dark text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          🎬 Ver cartelera de {info.name}
        </Link>
      </div>
    </div>
  );
}

