'use client';

// Client Component - Página de login:
// - Utiliza useState para manejar campos del formulario
// - Accede al contexto de autenticación para setUser
// - useRouter y useSearchParams para navegación
// - Tema oscuro de cine permanente

import { useState, useContext, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useContext(AuthContext);
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
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div className="max-w-md mx-auto mt-8 p-8 bg-gradient-to-br from-cinema-dark-card to-cinema-dark-elevated rounded-2xl shadow-lg border border-cinema-border">
        <h2 className="text-cinema-gold text-2xl font-bold text-center mb-2 pb-4 border-b-4 border-cinema-red">
          🎬 Iniciar Sesión
        </h2>
        <p className="text-cinema-text-muted text-center mb-6">Accede a tu cuenta de UNIR Cinema</p>

        {error && (
          <div className="bg-cinema-red/20 text-cinema-red-light p-3 rounded-lg mb-4 border border-cinema-red">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block mb-2 font-semibold text-cinema-text">
              Usuario:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Ingresa tu usuario"
              className="w-full p-3 rounded-lg border-2 border-cinema-border bg-cinema-dark-elevated text-cinema-text placeholder-cinema-text-muted/50 focus:border-cinema-gold focus:outline-none focus:ring-2 focus:ring-cinema-gold/20 transition-all"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 font-semibold text-cinema-text">
              Contraseña:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Ingresa tu contraseña"
              className="w-full p-3 rounded-lg border-2 border-cinema-border bg-cinema-dark-elevated text-cinema-text placeholder-cinema-text-muted/50 focus:border-cinema-gold focus:outline-none focus:ring-2 focus:ring-cinema-gold/20 transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cinema-gold to-cinema-gold-dark text-cinema-dark p-3 rounded-lg font-bold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cinema-gold/50 hover:brightness-110 transition-all duration-300"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-6 p-4 bg-cinema-dark-elevated rounded-lg border-l-4 border-cinema-gold">
          <p className="text-cinema-gold font-semibold mb-2">Usuarios de prueba:</p>
          <p className="text-cinema-text-muted text-sm">Admin: usuario = &quot;admin&quot;, contraseña = &quot;admin&quot;</p>
          <p className="text-cinema-text-muted text-sm">Usuario: usuario = &quot;user&quot;, contraseña = &quot;user&quot;</p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex-1 p-8 text-center text-cinema-text-muted">Cargando...</div>}>
      <LoginForm />
    </Suspense>
  );
}
