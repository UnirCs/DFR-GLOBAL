'use client';

import { use } from 'react';
import { useRouter, notFound } from 'next/navigation';
import PrivateRoute from '@/components/PrivateRoute';
import { useMovies } from '@/hooks/useMovies';

export default function CinemaDetailPage({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { darkMode, citiesData } = useMovies();

  const cityData = citiesData[resolvedParams.city];

  // Si la ciudad no existe, mostrar not-found
  if (!cityData) {
    notFound();
  }

  const cinemaInfo = {
    barcelona: {
      address: "Passeig de Gràcia, 123, Barcelona",
      phone: "934 567 890",
      screens: 12,
      capacity: 2500,
      parking: true,
      accessibility: true
    },
    madrid: {
      address: "Gran Vía, 45, Madrid",
      phone: "915 678 901",
      screens: 15,
      capacity: 3000,
      parking: true,
      accessibility: true
    },
    sevilla: {
      address: "Calle Sierpes, 67, Sevilla",
      phone: "954 789 012",
      screens: 8,
      capacity: 1800,
      parking: false,
      accessibility: true
    },
    valencia: {
      address: "Plaza del Ayuntamiento, 89, Valencia",
      phone: "963 890 123",
      screens: 10,
      capacity: 2200,
      parking: true,
      accessibility: true
    }
  };


  const info = cinemaInfo[resolvedParams.city];

  return (
    <PrivateRoute>
      <div className={`page-container ${darkMode ? 'dark' : ''}`}>
        <div className="movie-details">
          <button
            onClick={() => router.back()}
            className="nav-button"
            style={{ marginBottom: '2rem' }}
          >
            ← Volver
          </button>

          <h1>UNIR Cinema {cityData.name}</h1>

          <div className="movie-info-grid">
            <div className="info-item">
              <strong>Salas</strong><br/>
              {info.screens} pantallas
            </div>
            <div className="info-item">
              <strong>Capacidad</strong><br/>
              {info.capacity} butacas
            </div>
            <div className="info-item">
              <strong>Aparcamiento</strong><br/>
              {info.parking ? 'Disponible' : 'No disponible'}
            </div>
            <div className="info-item">
              <strong>Accesibilidad</strong><br/>
              {info.accessibility ? 'Adaptado' : 'No adaptado'}
            </div>
          </div>

          <div style={{ margin: '2rem 0' }}>
            <h3>Información de contacto:</h3>
            <p><strong>Dirección:</strong> {info.address}</p>
            <p><strong>Teléfono:</strong> {info.phone}</p>
            <p><strong>Horario:</strong> 10:00 - 00:30 todos los días</p>
          </div>

          <div style={{ margin: '2rem 0' }}>
            <h3>Cartelera actual:</h3>
            <p>Actualmente proyectamos {cityData.movies.length} películas</p>

            <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
              {cityData.movies.map(movie => (
                <div key={movie.id} style={{
                  padding: '1rem',
                  background: darkMode ? '#333' : '#f8f9fa',
                  borderRadius: '8px'
                }}>
                  <strong>{movie.title}</strong> - {movie.genre} ({movie.duration})
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
}

