import { getDictionary, getLocales } from "../dictionaries";
import LocalizedDate from "../components/LocalizedDate";
import styles from "./page.module.css";

/**
 * Genera las rutas estáticas para la página About
 */
export async function generateStaticParams() {
  const locales = getLocales();
  return locales.map((lang) => ({ lang }));
}

/**
 * Página About - Server Component
 * Demuestra el uso del diccionario y formateo de fechas en Server Components.
 */
export default async function AboutPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const foundedDate = new Date("2020-03-15");

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{dict.about.title}</h1>
      <p className={styles.description}>{dict.about.description}</p>

      <div className={styles.sections}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{dict.about.mission}</h2>
          <p className={styles.sectionText}>{dict.about.missionText}</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{dict.about.vision}</h2>
          <p className={styles.sectionText}>{dict.about.visionText}</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{dict.about.team}</h2>
          <div className={styles.teamGrid}>
            <div className={styles.teamMember}>
              <span className={styles.avatar}>👩‍💼</span>
              <span>María García</span>
              <span className={styles.role}>CEO</span>
            </div>
            <div className={styles.teamMember}>
              <span className={styles.avatar}>👨‍💻</span>
              <span>Carlos López</span>
              <span className={styles.role}>CTO</span>
            </div>
            <div className={styles.teamMember}>
              <span className={styles.avatar}>👩‍🎨</span>
              <span>Ana Martínez</span>
              <span className={styles.role}>Design Lead</span>
            </div>
          </div>
        </section>

        <section className={styles.foundedSection}>
          <p>
            {dict.about.foundedIn}:{" "}
            <strong>
              <LocalizedDate date={foundedDate} lang={lang} format="long" />
            </strong>
          </p>
        </section>
      </div>
    </div>
  );
}

