/**
 * Componente para formatear números según el locale.
 * Puede ser usado como Server Component o Client Component.
 *
 * @param {number} value - Número a formatear
 * @param {string} lang - Código del idioma (es, en, fr)
 * @param {string} style - Estilo de formateo: 'decimal', 'currency', 'percent'
 */
export default function LocalizedNumber({ value, lang, style = "decimal" }) {
  // Mapeo de códigos de idioma a locales completos de Intl
  const localeMap = {
    es: "es-ES",
    en: "en-US",
    fr: "fr-FR",
  };

  const locale = localeMap[lang] || "es-ES";

  // Configuración de opciones según el estilo
  const options = {
    decimal: {},
    currency: {
      style: "currency",
      currency: lang === "en" ? "USD" : "EUR",
    },
    percent: {
      style: "percent",
      minimumFractionDigits: 1,
    },
  };

  const formatter = new Intl.NumberFormat(locale, options[style] || {});

  return <>{formatter.format(value)}</>;
}

