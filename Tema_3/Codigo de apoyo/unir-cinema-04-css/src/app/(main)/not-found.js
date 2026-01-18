'use client';
import Link from 'next/link';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.notFoundContainer}>
        <h1 className={styles.errorCode}>404</h1>
        <h2 className={styles.title}>Página no encontrada</h2>
        <p className={styles.message}>
          Lo sentimos, la página que buscas no existe en UNIR Cinema.
        </p>
        <Link href="/" className={styles.navButton}>
          🎬 Volver al inicio
        </Link>
      </div>
    </div>
  );
}
