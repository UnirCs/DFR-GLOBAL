# Ejemplo de Internacionalización (i18n/l10n) en Next.js

Este proyecto demuestra cómo implementar internacionalización y localización en una aplicación Next.js utilizando el App Router, sin dependencias externas de i18n.

## 🌍 Características

- **3 idiomas soportados**: Español (es), Inglés (en), Francés (fr)
- **Rutas localizadas**: `/es/products`, `/en/products`, `/fr/products`
- **SSG con `generateStaticParams`**: Páginas pre-renderizadas en build time
- **Detección automática de idioma**: Middleware que detecta el idioma preferido
- **Formateo localizado**: Números, monedas y fechas con `Intl`
- **Context API**: Para acceder a traducciones en Client Components

## 📁 Estructura del Proyecto

```
src/
├── proxy.js                         # Proxy para detección de locale
└── app/
    ├── globals.css
    └── [lang]/                      # Segmento dinámico para el idioma
        ├── layout.js                # Layout con TranslationsProvider
        ├── page.js                  # Página principal
        ├── dictionaries.js          # Cargador de diccionarios (server-only)
        ├── dictionaries/
        │   ├── es.json              # Traducciones español
        │   ├── en.json              # Traducciones inglés
        │   └── fr.json              # Traducciones francés
        ├── i18n/
        │   └── TranslationsProvider.js  # Context + Hook para Client Components
        ├── components/
        │   ├── LocalizedLink.js     # Link con prefijo de idioma automático
        │   ├── LanguageSwitcher.js  # Selector de idioma con banderas
        │   ├── Nav.js               # Navegación localizada
        │   ├── LocalizedNumber.js   # Formateo de números con Intl
        │   ├── LocalizedDate.js     # Formateo de fechas con Intl
        │   └── NewsletterForm.js    # Client Component (traducciones via props)
        ├── products/
        │   ├── page.js
        │   └── InteractivePanel.js  # Client Component (usa useI18n hook)
        └── about/
            └── page.js
```

## 🔑 Conceptos Fundamentales

### 1. Proxy para Detección de Locale

El archivo `proxy.js` actúa como proxy que:
- Detecta el idioma preferido del usuario via `Accept-Language`
- Redirige automáticamente a la ruta con el locale correcto
- Evita procesar assets estáticos y rutas API

```javascript
// src/proxy.js
export function proxy(request) {
  const { pathname } = request.nextUrl;
  
  // Verificar si ya tiene locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  
  if (pathnameHasLocale) return;
  
  // Detectar y redirigir
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}
```

### 2. Generación Estática con `generateStaticParams`

Cada página define sus rutas estáticas para SSG:

```javascript
// En cada page.js
export async function generateStaticParams() {
  const locales = getLocales(); // ["es", "en", "fr"]
  return locales.map((lang) => ({ lang }));
}
```

Esto genera en build time:
- `/es`, `/en`, `/fr`
- `/es/products`, `/en/products`, `/fr/products`
- `/es/about`, `/en/about`, `/fr/about`

### 3. Diccionarios y Carga de Traducciones

Los diccionarios son archivos JSON que se cargan dinámicamente:

```javascript
// src/app/[lang]/dictionaries.js
import "server-only";

const dictionaries = {
  es: () => import("./dictionaries/es.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  fr: () => import("./dictionaries/fr.json").then((m) => m.default),
};

export async function getDictionary(locale) {
  return dictionaries[locale]();
}
```

**Nota**: `server-only` asegura que este módulo solo se use en Server Components.

### 4. TranslationsProvider para Client Components

Context que expone las traducciones a componentes cliente:

```javascript
// src/app/[lang]/i18n/TranslationsProvider.js
"use client";

const I18nContext = createContext(null);

export function TranslationsProvider({ lang, dict, children }) {
  const value = useMemo(() => ({ lang, dict }), [lang, dict]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n debe usarse dentro de TranslationsProvider");
  return ctx;
}
```

### 5. Dos Formas de Pasar Traducciones a Client Components

#### Opción A: Via Props (Recomendado para componentes específicos)

```javascript
// Server Component
<NewsletterForm 
  title={dict.home.newsletter}
  placeholder={dict.home.newsletterPlaceholder}
  buttonText={dict.home.subscribe}
/>

// Client Component
export default function NewsletterForm({ title, placeholder, buttonText }) {
  return <button>{buttonText}</button>;
}
```

#### Opción B: Via Context (Para componentes que necesitan muchas traducciones)

```javascript
// Client Component
"use client";
import { useI18n } from "../i18n/TranslationsProvider";

export default function InteractivePanel() {
  const { dict, lang } = useI18n();
  return <button>{dict.products.cart}</button>;
}
```

### 6. LocalizedLink - Links sin Prefijo Manual

Componente que añade automáticamente el locale actual:

```javascript
// En lugar de:
<Link href={`/${lang}/products`}>Products</Link>

// Usa:
<LocalizedLink href="/products">Products</LocalizedLink>
```

### 7. Formateo con Intl

#### Números y Monedas

```javascript
// LocalizedNumber.js
const formatter = new Intl.NumberFormat(locale, {
  style: "currency",
  currency: lang === "en" ? "USD" : "EUR",
});
return formatter.format(value);
```

**Ejemplos de salida:**
- ES: `1.234.567` / `9.876.543,21 €`
- EN: `1,234,567` / `$9,876,543.21`
- FR: `1 234 567` / `9 876 543,21 €`

#### Fechas

```javascript
// LocalizedDate.js
const formatter = new Intl.DateTimeFormat(locale, {
  day: "numeric",
  month: "long",
  year: "numeric",
});
return formatter.format(date);
```

**Ejemplos de salida:**
- ES: `14 de enero de 2026`
- EN: `January 14, 2026`
- FR: `14 janvier 2026`

### 8. Selector de Idioma con Banderas

```javascript
// LanguageSwitcher.js
const languages = [
  { code: "es", flag: "🇪🇸", name: "Español" },
  { code: "en", flag: "🇺🇸", name: "English" },
  { code: "fr", flag: "🇫🇷", name: "Français" },
];
```

## 🚀 Comandos

```bash
# Desarrollo
npm run dev

# Build (genera páginas estáticas para todos los locales)
npm run build

# Producción
npm run start
```

## 📊 Resumen de Componentes

| Componente | Tipo | Método i18n | Descripción |
|------------|------|-------------|-------------|
| `layout.js` | Server | `getDictionary()` | Carga el diccionario y provee el contexto |
| `page.js` | Server | `getDictionary()` | Usa traducciones directamente |
| `Nav.js` | Client | `useI18n()` | Accede al contexto |
| `NewsletterForm.js` | Client | Props | Recibe traducciones como props |
| `InteractivePanel.js` | Client | `useI18n()` | Accede al contexto |
| `LocalizedNumber.js` | Server/Client | `Intl.NumberFormat` | Formatea números |
| `LocalizedDate.js` | Server/Client | `Intl.DateTimeFormat` | Formatea fechas |
| `LocalizedLink.js` | Client | `useParams()` | Auto-prefija enlaces |
| `LanguageSwitcher.js` | Client | `useParams()` | Cambia de idioma |

## 📚 Referencias

- [Next.js Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [MDN Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
- [MDN Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)

