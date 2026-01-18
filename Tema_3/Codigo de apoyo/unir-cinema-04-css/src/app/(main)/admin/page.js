'use client';

// Client Component - Panel de administración:
// - Requiere PrivateRoute (client) para proteger acceso
// - Accede al contexto global para el modo oscuro

import PrivateRoute from '@/components/PrivateRoute';
import { useMovies } from '@/hooks/useMovies';

export default function AdminPage() {
  const { darkMode } = useMovies();

  return (
    <PrivateRoute>
      <div className={`page-container ${darkMode ? 'dark' : ''}`}>
        <div className="movie-details">
          <h1>Panel de Administración</h1>
          <p>Contenido solo para administradores</p>

          <div className="movie-info-grid">
            <div className="info-item">
              <strong>Usuarios registrados</strong><br/>
              4 usuarios
            </div>
            <div className="info-item">
              <strong>Películas</strong><br/>
              12 títulos
            </div>
            <div className="info-item">
              <strong>Ciudades</strong><br/>
              4 ubicaciones
            </div>
            <div className="info-item">
              <strong>Reservas hoy</strong><br/>
              156 entradas
            </div>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
}

