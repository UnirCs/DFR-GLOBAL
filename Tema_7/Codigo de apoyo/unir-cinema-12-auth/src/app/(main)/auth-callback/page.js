'use client';

/**
 * Pagina de callback post-autenticacion
 *
 * Esta pagina se carga automaticamente despues del login con Auth0.
 * Su unica funcion es:
 * 1. Llamar a /api/v1/sync para sincronizar el usuario con la BD
 * 2. Redirigir al usuario a su destino original (returnTo) o a la home
 *
 * El parametro returnTo viene de la URL cuando el proxy redirige a login.
 *
 * NOTA: useSearchParams() requiere un Suspense boundary para evitar
 * errores de prerendering en Next.js.
 */

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import clsx from 'clsx';

// Componente de carga mientras se resuelve el Suspense
function LoadingState() {
  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full flex items-center justify-center min-h-[50vh]">
      <div className={clsx(
        'max-w-md mx-auto p-8 text-center',
        'bg-gradient-to-br from-cinema-dark-card to-cinema-dark-elevated',
        'rounded-2xl shadow-lg border border-cinema-border'
      )}>
        <div className="text-4xl mb-4 animate-spin">🎬</div>
        <h2 className="text-cinema-gold text-xl font-bold mb-2">
          Cargando...
        </h2>
      </div>
    </div>
  );
}

// Componente interno que usa useSearchParams
function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('syncing');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function syncUser() {
      try {
        // Llamar al endpoint de sincronizacion
        const response = await fetch('/api/v1/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          setError(errorData.error || 'Error sincronizando usuario');
          setStatus('error');
          return;
        }

        const data = await response.json();
        console.log('[AUTH-CALLBACK] Usuario sincronizado:', data.user?.email);

        setStatus('success');

        // Redirigir al destino original o a la home
        const returnTo = searchParams.get('returnTo') || '/';

        // Pequeno delay para mostrar el mensaje de exito
        setTimeout(() => {
          router.push(returnTo);
        }, 1500);

      } catch (err) {
        console.error('[AUTH-CALLBACK] Error:', err);
        setError(err.message);
        setStatus('error');
      }
    }

    syncUser();
  }, [router, searchParams]);

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full flex items-center justify-center min-h-[50vh]">
      <div className={clsx(
        'max-w-md mx-auto p-8 text-center',
        'bg-gradient-to-br from-cinema-dark-card to-cinema-dark-elevated',
        'rounded-2xl shadow-lg border border-cinema-border'
      )}>
        {status === 'syncing' && (
          <>
            <div className="text-4xl mb-4 animate-spin">🎬</div>
            <h2 className="text-cinema-gold text-xl font-bold mb-2">
              Preparando tu sesion...
            </h2>
            <p className="text-cinema-text-muted">
              Sincronizando tu cuenta con UNIR Cinema
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-green-400 text-xl font-bold mb-2">
              ¡Bienvenido!
            </h2>
            <p className="text-cinema-text-muted">
              Redirigiendo...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-4xl mb-4">❌</div>
            <h2 className="text-red-400 text-xl font-bold mb-2">
              Error de sincronizacion
            </h2>
            <p className="text-cinema-text-muted mb-4">
              {error}
            </p>
            <button
              onClick={() => router.push('/')}
              className={clsx(
                'px-6 py-2 rounded-lg font-bold',
                'bg-gradient-to-r from-cinema-gold to-cinema-gold-dark text-cinema-dark',
                'hover:-translate-y-0.5 transition-all duration-300'
              )}
            >
              Ir al inicio
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Componente principal con Suspense boundary
export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <AuthCallbackContent />
    </Suspense>
  );
}

