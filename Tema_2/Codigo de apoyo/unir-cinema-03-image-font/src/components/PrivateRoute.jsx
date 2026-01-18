'use client';

// Client Component - Requiere interactividad:
// - useContext para acceder al estado de autenticación
// - useEffect para redireccionar si no hay usuario
// - useRouter para navegación programática

import { useContext, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) {
      router.push(`/login?from=${encodeURIComponent(pathname)}`);
    }
  }, [user, router, pathname]);

  if (!user) {
    return (
      <div className="page-container">
        <p>Redirigiendo al login...</p>
      </div>
    );
  }

  return children;
};

export default PrivateRoute;

