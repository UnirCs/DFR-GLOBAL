"use client";

import { useState } from "react";
import { useI18n } from "../i18n/TranslationsProvider";
import styles from "./InteractivePanel.module.css";

/**
 * Client Component que utiliza el contexto de i18n (useI18n hook).
 * Demuestra cómo acceder al diccionario completo desde un Client Component.
 */
export default function InteractivePanel() {
  const { dict, lang } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: dict.products.all },
    { id: "electronics", label: dict.products.electronics },
    { id: "clothing", label: dict.products.clothing },
    { id: "books", label: dict.products.books },
  ];

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>{dict.products.categories}</h3>
      <div className={styles.categoryButtons}>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`${styles.categoryButton} ${
              selectedCategory === category.id ? styles.active : ""
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
      <div className={styles.cartSection}>
        <button className={styles.cartButton}>
          🛒 {dict.products.cart}
        </button>
        <span className={styles.langIndicator}>
          {dict.common.language}: {lang.toUpperCase()}
        </span>
      </div>
    </div>
  );
}

