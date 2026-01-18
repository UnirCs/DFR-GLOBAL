'use client';

// Client Component - Página de login:
// - Utiliza useState para manejar campos del formulario
// - Accede al contexto de autenticación para setUser
// - useRouter y useSearchParams para navegación

import { useState, useContext, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import { useMovies } from '@/hooks/useMovies';
import styles from './LoginPage.module.css';

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
    <div className={`${styles.container} ${darkMode ? styles.dark : ''}`}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Iniciar Sesión</h2>
        <p className={styles.subtitle}>Accede a tu cuenta de UNIR Cinema</p>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>Usuario:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Ingresa tu usuario"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Contraseña:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Ingresa tu contraseña"
              className={styles.input}
            />
          </div>

          <button type="submit" className={styles.btn}>
            Iniciar Sesión
          </button>
        </form>

        <div className={styles.loginHelp}>
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
    <Suspense fallback={<div>Cargando...</div>}>
      <LoginForm />
    </Suspense>
  );
}
