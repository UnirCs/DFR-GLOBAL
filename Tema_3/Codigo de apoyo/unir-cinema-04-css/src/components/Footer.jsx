// Server Component - No requiere interactividad, solo renderiza contenido estático
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p className={styles.footerText}>&copy; 2026 UNIR Cinema. Todos los derechos reservados.</p>
    </footer>
  );
};

export default Footer;
