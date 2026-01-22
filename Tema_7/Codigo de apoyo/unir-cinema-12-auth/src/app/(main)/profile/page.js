// Server Component - Pagina de perfil con Auth0
// Muestra los datos del usuario autenticado
// La sincronizacion con la BD ya se hizo en /auth-callback

import { auth0 } from '@/lib/auth0';
import { findUserByEmail } from '@/app/api/v1/_store';
import { redirect } from 'next/navigation';
import clsx from 'clsx';


export default async function ProfilePage() {
  console.log("[SERVER] Obteniendo sesion de usuario desde ProfilePage...");
  const session = await auth0.getSession();

  // Si no hay sesion, redirigir al login
  if (!session) {
    redirect('/auth/login');
  }

  const { user: auth0User } = session;

  // Obtener usuario de la BD (ya fue sincronizado en /auth-callback)
  const dbUser = await findUserByEmail(auth0User.email);

  // Si por alguna razon no existe en la BD, usar datos de Auth0
  const user = dbUser || {
    name: auth0User.name || auth0User.email.split('@')[0],
    email: auth0User.email,
    role: 'user'
  };

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div className={clsx(
        'max-w-md mx-auto mt-8 p-8',
        'bg-gradient-to-br from-cinema-dark-card to-cinema-dark-elevated',
        'rounded-2xl shadow-lg border border-cinema-border'
      )}>
        <h2 className="text-cinema-gold text-2xl font-bold text-center mb-2 pb-4 border-b-4 border-cinema-red">
          Perfil de Usuario
        </h2>

        <div className="space-y-4 mt-6">
          {auth0User.picture && (
            <div className="flex justify-center">
              <img
                src={auth0User.picture}
                alt="Avatar"
                className="w-24 h-24 rounded-full border-4 border-cinema-gold"
              />
            </div>
          )}

          <div className="bg-cinema-dark-elevated p-4 rounded-lg">
            <p className="text-cinema-text-muted text-sm">Nombre</p>
            <p className="text-cinema-text font-semibold">{user.name}</p>
          </div>

          <div className="bg-cinema-dark-elevated p-4 rounded-lg">
            <p className="text-cinema-text-muted text-sm">Email</p>
            <p className="text-cinema-text font-semibold">{user.email}</p>
          </div>

          <div className="bg-cinema-dark-elevated p-4 rounded-lg">
            <p className="text-cinema-text-muted text-sm">Rol</p>
            <p className="text-cinema-text font-semibold capitalize">{user.role}</p>
          </div>

          <div className="mt-6 p-4 bg-cinema-dark-elevated rounded-lg border-l-4 border-green-500">
            <p className="text-green-400 font-semibold">Autenticado con Google via Auth0</p>
            <p className="text-cinema-text-muted text-sm mt-1">Tu cuenta esta sincronizada con nuestra base de datos.</p>
          </div>
        </div>

        <a
          href="/auth/logout"
          className={clsx(
            'block w-full mt-6 p-3 rounded-lg font-bold text-center',
            'bg-gradient-to-r from-cinema-red to-cinema-red-dark text-white',
            'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cinema-red/50',
            'transition-all duration-300'
          )}
        >
          Cerrar Sesion
        </a>
      </div>
    </div>
  );
}

