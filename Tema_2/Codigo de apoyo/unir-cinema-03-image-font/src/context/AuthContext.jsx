'use client';

// Client Component - Proveedor de contexto:
// - Los contextos de React deben ser Client Components
// - Utiliza useState para manejar el estado del usuario autenticado

import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
