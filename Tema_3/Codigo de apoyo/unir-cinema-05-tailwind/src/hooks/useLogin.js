'use client';

// Hook personalizado - Debe ser usado solo en Client Components
// - Utiliza useState para manejar estados de carga y error
// - Simula una operación asíncrona de login

import { useState } from 'react';
import { usersData } from '@/data/usersData';

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const found = usersData.find(u => u.username === username && u.password === password);
      if (!found) {
        throw new Error("Credenciales inválidas");
      }
      return found;
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

