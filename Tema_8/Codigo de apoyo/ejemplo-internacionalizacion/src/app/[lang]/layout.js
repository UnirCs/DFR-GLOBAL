import { notFound } from "next/navigation";
import { getDictionary, hasLocale, getLocales } from "./dictionaries";
import { TranslationsProvider } from "./i18n/TranslationsProvider";
import Nav from "./components/Nav";
import LanguageSwitcher from "./components/LanguageSwitcher";
import "../globals.css";
import styles from "./layout.module.css";

/**
 * Genera las rutas estáticas para cada locale en build time (SSG).
 * Esto permite que Next.js pre-renderice las páginas para cada idioma.
 */
export async function generateStaticParams() {
  const locales = getLocales();
  return locales.map((lang) => ({ lang }));
}


/**
 * Layout principal que envuelve todas las páginas con el idioma correspondiente.
 * - Valida que el locale sea soportado
 * - Carga el diccionario correspondiente
 * - Provee las traducciones a los componentes cliente
 */
export default async function LangLayout({ children, params }) {
  const { lang } = await params;

  // Verificar que el locale sea válido
  if (!hasLocale(lang)) {
    notFound();
  }

  // Cargar el diccionario del idioma
  const dict = await getDictionary(lang);

  return (
    <html lang={lang}>
      <body>
        <TranslationsProvider lang={lang} dict={dict}>
          <header className={styles.header}>
            <Nav />
            <LanguageSwitcher />
          </header>
          <main className={styles.main}>{children}</main>
          <footer className={styles.footer}>
            <p>© 2026 - {dict.common.language}: {lang.toUpperCase()}</p>
          </footer>
        </TranslationsProvider>
      </body>
    </html>
  );
}

