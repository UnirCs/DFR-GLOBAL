'use client';

// Client Component - Panel de administración:
// - Requiere PrivateRoute (client) para proteger acceso
// - Tema oscuro de cine permanente
// - Uso de clsx para organizar las clases de Tailwind

import clsx from 'clsx';
import PrivateRoute from '@/components/PrivateRoute';

export default function AdminPage() {
  const stats = [
    { icon: '👥', label: 'Usuarios registrados', value: '4 usuarios' },
    { icon: '🎬', label: 'Películas', value: '12 títulos' },
    { icon: '📍', label: 'Ciudades', value: '4 ubicaciones' },
    { icon: '🎟️', label: 'Reservas hoy', value: '156 entradas' },
  ];

  // Clases reutilizables para las tarjetas de estadísticas
  const statCardClasses = clsx(
    'bg-cinema-dark-elevated p-5 rounded-xl text-center',
    'border border-cinema-border',
    'hover:border-cinema-gold hover:-translate-y-1',
    'transition-all duration-300',
    'hover:shadow-lg hover:shadow-cinema-gold/20'
  );

  return (
    <PrivateRoute>
      <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        <div className={clsx(
          'bg-gradient-to-br from-cinema-dark-card to-cinema-dark-elevated',
          'p-8 rounded-2xl shadow-lg border border-cinema-border'
        )}>
          <h1 className="text-cinema-gold text-3xl font-bold text-center mb-2 pb-4 border-b-4 border-cinema-red">
            🎬 Panel de Administración
          </h1>
          <p className="text-cinema-text-muted text-center mb-8">Contenido solo para administradores</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className={statCardClasses}>
                <span className="text-3xl block mb-2">{stat.icon}</span>
                <strong className="text-cinema-gold text-sm block mb-1">{stat.label}</strong>
                <span className="text-cinema-text text-xl font-bold">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
}
