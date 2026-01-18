'use client';

// Client Component - Proveedor de contexto:
// - Los contextos de React deben ser Client Components
// - Utiliza useState para manejar el estado del usuario autenticado
// - Se sincroniza con la cookie de sesion establecida por el proxy

import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

/**
 * Lee la cookie de sesion y extrae los datos del usuario
 * @returns {object|null} Datos del usuario o null si no hay sesion
 */
function getSessionFromCookie() {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split(';');
  const sessionCookie = cookies.find(c => c.trim().startsWith('unir-cinema-session='));

  if (!sessionCookie) return null;

  try {
    const cookieValue = sessionCookie.split('=')[1];
    const decoded = decodeURIComponent(cookieValue);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Sincronizar el estado con la cookie al montar el componente
  useEffect(() => {
    const sessionData = getSessionFromCookie();
    if (sessionData) {
      setUser({
        name: sessionData.name,
        role: sessionData.role,
        username: sessionData.username
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
