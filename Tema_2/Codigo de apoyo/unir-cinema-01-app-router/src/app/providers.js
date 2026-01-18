'use client';

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

