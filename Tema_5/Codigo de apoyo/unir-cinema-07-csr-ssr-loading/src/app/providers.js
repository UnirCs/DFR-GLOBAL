'use client';

// Client Component - Wrapper de proveedores de contexto
// - Agrupa todos los proveedores de contexto (Auth y Global)
// - Debe ser client porque los Context Providers requieren estado de React

import { AuthProvider } from '@/context/AuthContext';
import { GlobalProvider } from '@/context/GlobalContext';

export function Providers({ children }) {
  return (
    <AuthProvider>
      <GlobalProvider>
        {children}
      </GlobalProvider>
    </AuthProvider>
  );
}

