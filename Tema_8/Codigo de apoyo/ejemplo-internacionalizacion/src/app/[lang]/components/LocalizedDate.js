/**
 * Componente para formatear fechas según el locale.
 * Puede ser usado como Server Component o Client Component.
 *
 * @param {Date|string} date - Fecha a formatear
 * @param {string} lang - Código del idioma (es, en, fr)
 * @param {string} format - Formato: 'short', 'medium', 'long', 'full'
 */
export default function LocalizedDate({ date, lang, format = "long" }) {
  // Mapeo de códigos de idioma a locales completos de Intl
  const localeMap = {
    es: "es-ES",
    en: "en-US",
    fr: "fr-FR",
  };

  const locale = localeMap[lang] || "es-ES";

  // Configuración de opciones según el formato
  const formatOptions = {
    short: {
      day: "numeric",
      month: "numeric",
      year: "2-digit",
    },
    medium: {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
    long: {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
    full: {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  };

  const dateObj = typeof date === "string" ? new Date(date) : date;
  const formatter = new Intl.DateTimeFormat(locale, formatOptions[format] || formatOptions.long);

  return <>{formatter.format(dateObj)}</>;
}

