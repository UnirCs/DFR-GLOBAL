"use client";

import { useI18n } from "../i18n/TranslationsProvider";
import LocalizedLink from "./LocalizedLink";
import styles from "./Nav.module.css";

/**
 * Barra de navegación que utiliza el contexto de i18n
 * para mostrar los textos traducidos.
 */
export default function Nav() {
  const { dict } = useI18n();

  return (
    <nav className={styles.nav}>
      <div className={styles.navLinks}>
        <LocalizedLink href="/" className={styles.link}>
          {dict.nav.home}
        </LocalizedLink>
        <LocalizedLink href="/products" className={styles.link}>
          {dict.nav.products}
        </LocalizedLink>
        <LocalizedLink href="/about" className={styles.link}>
          {dict.nav.about}
        </LocalizedLink>
      </div>
    </nav>
  );
}

