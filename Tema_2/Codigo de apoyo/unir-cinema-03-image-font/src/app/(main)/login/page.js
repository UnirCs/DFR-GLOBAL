'use client';

// Client Component - Página de login:
// - Utiliza useState para manejar campos del formulario
// - Accede al contexto de autenticación para setUser
// - useRouter y useSearchParams para navegación

import { useState, useContext, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import { useMovies } from '@/hooks/useMovies';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useContext(AuthContext);
  const { darkMode } = useMovies();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === 'admin' && password === 'admin') {
      setUser({ name: 'Administrador', role: 'admin' });
      const from = searchParams.get('from') || '/';
      router.push(from);
    } else if (username === 'user' && password === 'user') {
      setUser({ name: 'Usuario', role: 'user' });
      const from = searchParams.get('from') || '/';
      router.push(from);
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className={`page-container ${darkMode ? 'dark' : ''}`}>
      <div className="form-container">
        <h2>Iniciar Sesión</h2>
        <p>Accede a tu cuenta de UNIR Cinema</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Usuario:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Ingresa tu usuario"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Ingresa tu contraseña"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Iniciar Sesión
          </button>
        </form>

        <div className="login-help">
          <p><strong>Usuarios de prueba:</strong></p>
          <p>Admin: usuario = &quot;admin&quot;, contraseña = &quot;admin&quot;</p>
          <p>Usuario: usuario = &quot;user&quot;, contraseña = &quot;user&quot;</p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="page-container"><p>Cargando...</p></div>}>
      <LoginForm />
    </Suspense>
  );
}
