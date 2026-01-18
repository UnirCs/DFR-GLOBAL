import "server-only";

const locales = ["es", "en", "fr"];

const dictionaries = {
  es: () => import("./dictionaries/es.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  fr: () => import("./dictionaries/fr.json").then((m) => m.default),
};

export function getLocales() {
  return locales;
}

export function hasLocale(locale) {
  return Object.prototype.hasOwnProperty.call(dictionaries, locale);
}

export async function getDictionary(locale) {
  if (!hasLocale(locale)) {
    throw new Error(`Locale "${locale}" not supported`);
  }
  return dictionaries[locale]();
}

