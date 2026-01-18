import { getDictionary, getLocales } from "../dictionaries";
import InteractivePanel from "./InteractivePanel";
import styles from "./page.module.css";

/**
 * Genera las rutas estáticas para la página de productos
 */
export async function generateStaticParams() {
  const locales = getLocales();
  return locales.map((lang) => ({ lang }));
}

/**
 * Página de productos - Server Component
 * Demuestra:
 * - Uso del diccionario en Server Components
 * - Integración con Client Components que usan el contexto i18n
 */
export default async function ProductsPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  // Productos de ejemplo
  const products = [
    { id: 1, name: "Laptop Pro", price: 1299.99, inStock: true },
    { id: 2, name: "Smartphone X", price: 899.50, inStock: true },
    { id: 3, name: "Wireless Headphones", price: 199.99, inStock: false },
    { id: 4, name: "Smart Watch", price: 349.00, inStock: true },
  ];

  // Mapeo de códigos de idioma a locales completos de Intl
  const localeMap = {
    es: "es-ES",
    en: "en-US",
    fr: "fr-FR",
  };

  const locale = localeMap[lang] || "es-ES";
  const currency = lang === "en" ? "USD" : "EUR";

  const formatPrice = (price) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(price);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{dict.products.title}</h1>
      <p className={styles.description}>{dict.products.description}</p>

      {/* Panel interactivo - Client Component que usa useI18n */}
      <InteractivePanel />

      <div className={styles.productsGrid}>
        {products.map((product) => (
          <div key={product.id} className={styles.productCard}>
            <div className={styles.productImage}>
              <span className={styles.productEmoji}>📦</span>
            </div>
            <h3 className={styles.productName}>{product.name}</h3>
            <p className={styles.productPrice}>
              {dict.products.price}: {formatPrice(product.price)}
            </p>
            <span
              className={`${styles.stockBadge} ${
                product.inStock ? styles.inStock : styles.outOfStock
              }`}
            >
              {product.inStock ? dict.products.stock : dict.products.outOfStock}
            </span>
            <button
              className={styles.addToCartButton}
              disabled={!product.inStock}
            >
              {dict.products.addToCart}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

