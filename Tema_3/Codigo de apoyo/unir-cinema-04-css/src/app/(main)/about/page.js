// Server Component - Contenido estático de la página "Sobre Nosotros"
// El contenedor con darkMode se maneja desde el layout

import styles from './AboutPage.module.css';

export default function AboutPage() {
  return (
    <div className={styles.aboutContent}>
      <h2 className={styles.aboutTitle}>Sobre UNIR Cinema</h2>

      <div className={styles.aboutSection}>
        <h3 className={styles.sectionTitle}>¿Quiénes somos?</h3>
        <p className={styles.sectionText}>
          UNIR Cinema es la cadena de cines líder en España, ofreciendo la mejor experiencia
          cinematográfica en las principales ciudades del país.
        </p>
      </div>

      <div className={styles.aboutSection}>
        <h3 className={styles.sectionTitle}>Nuestra Historia</h3>
        <p className={styles.sectionText}>
          Fundada en 2015, UNIR Cinema nació con la visión de revolucionar la experiencia
          cinematográfica en España.
        </p>
      </div>

      <div className={styles.aboutSection}>
        <h3 className={styles.sectionTitle}>Nuestras Ciudades</h3>
        <div className={styles.citiesGrid}>
          <div className={styles.cityCard}>
            <h4 className={styles.cityName}>🏙️ Madrid</h4>
            <p>Nuestra sede principal con salas modernas.</p>
          </div>
          <div className={styles.cityCard}>
            <h4 className={styles.cityName}>🌊 Barcelona</h4>
            <p>Experiencia cinematográfica mediterránea.</p>
          </div>
          <div className={styles.cityCard}>
            <h4 className={styles.cityName}>🍊 Valencia</h4>
            <p>Tradición y modernidad unidas.</p>
          </div>
          <div className={styles.cityCard}>
            <h4 className={styles.cityName}>🌞 Sevilla</h4>
            <p>El arte del cine en Andalucía.</p>
          </div>
        </div>
      </div>

      <div className={styles.contactInfo}>
        <h3 className={styles.contactTitle}>Contacto</h3>
        <p className={styles.contactText}>📧 Email: info@unircinema.es</p>
        <p className={styles.contactText}>📞 Teléfono: +34 900 123 456</p>
      </div>
    </div>
  );
}
