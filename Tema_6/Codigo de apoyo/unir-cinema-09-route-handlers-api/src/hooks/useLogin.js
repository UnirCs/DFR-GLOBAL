'use client';

// Hook personalizado - Debe ser usado solo en Client Components
// - Utiliza useState para manejar estados de carga y error
// - Realiza petición a la API local de autenticación (sin cache)
// - API Base: /api/v1

import { useState } from 'react';
import { loginUser } from '@/lib/api';

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      // Llamada a la API - no se cachea (cache: 'no-store')
      const userData = await loginUser(username, password);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};

export default useLogin;

