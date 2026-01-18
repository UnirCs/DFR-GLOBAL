'use client';

// Client Component - Requiere interactividad:
// - useContext para acceder al estado de autenticación
// - useEffect para redireccionar si no hay usuario
// - useRouter para navegación programática
// - Tema oscuro de cine permanente

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
      <div className="flex-1 p-8 max-w-7xl mx-auto w-full flex items-center justify-center min-h-[50vh]">
        <p className="text-cinema-gold text-xl">🎬 Redirigiendo al login...</p>
      </div>
    );
  }

  return <div className="w-full">{children}</div>;
};

export default PrivateRoute;
