import { getDictionary, getLocales } from "./dictionaries";
import LocalizedDate from "./components/LocalizedDate";
import LocalizedNumber from "./components/LocalizedNumber";
import NewsletterForm from "./components/NewsletterForm";
import styles from "./page.module.css";

/**
 * Genera las rutas estáticas para la página principal
 */
export async function generateStaticParams() {
  const locales = getLocales();
  return locales.map((lang) => ({ lang }));
}

/**
 * Página principal - Server Component
 * Demuestra:
 * - Uso del diccionario en un Server Component
 * - Formateo de números y fechas con Intl
 * - Paso de traducciones a Client Components via props
 */
export default async function HomePage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  // Datos de ejemplo para demostrar formateo
  const currentDate = new Date();
  const visitorCount = 1234567;
  const salesAmount = 9876543.21;

  return (
    <div className={styles.container}>
      {/* Hero Section - Server Component con traducciones */}
      <section className={styles.hero}>
        <h1 className={styles.title}>{dict.home.title}</h1>
        <p className={styles.subtitle}>{dict.home.subtitle}</p>
        <p className={styles.description}>{dict.home.description}</p>
      </section>

      {/* Estadísticas - Server Component con formateo Intl */}
      <section className={styles.stats}>
        <h2>{dict.stats.title}</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>{dict.stats.visitors}</span>
            <span className={styles.statValue}>
              {/* Formateo de números usando Intl directamente en Server Component */}
              <LocalizedNumber value={visitorCount} lang={lang} />
            </span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>{dict.stats.sales}</span>
            <span className={styles.statValue}>
              {/* Formateo de moneda */}
              <LocalizedNumber value={salesAmount} lang={lang} style="currency" />
            </span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>{dict.stats.lastUpdated}</span>
            <span className={styles.statValue}>
              {/* Formateo de fechas */}
              <LocalizedDate date={currentDate} lang={lang} />
            </span>
          </div>
        </div>
      </section>

      {/* Newsletter Form - Client Component que recibe traducciones via props */}
      <section className={styles.newsletter}>
        <NewsletterForm
          title={dict.home.newsletter}
          placeholder={dict.home.newsletterPlaceholder}
          buttonText={dict.home.subscribe}
        />
      </section>
    </div>
  );
}

