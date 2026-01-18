# UNIR Cinema - SEO Optimizado

Este documento describe las optimizaciones de SEO implementadas en la aplicación UNIR Cinema.

## 📋 Resumen de Cambios SEO

### 1. Metadatos Dinámicos con `generateMetadata`

Se ha implementado la función `generateMetadata` de Next.js en las siguientes páginas para generar metadatos dinámicos según el idioma y contenido:

#### Landing Page (`/[lang]/page.js`)
- **Título**: Dinámico según idioma (ej: "UNIR Cinema - Tu destino cinematográfico")
- **Descripción**: Texto descriptivo sobre la experiencia cinematográfica
- **Open Graph**: Tipo `website`, incluye título, descripción, locale y siteName

#### Cartelera por Ciudad (`/[lang]/cartelera/[city]/page.js`)
- **Título**: `{Ciudad} - Cartelera` (ej: "Madrid - Cartelera")
- **Descripción**: Dinámico con nombre de ciudad
- **Open Graph**: Tipo `website`, metadatos completos

#### Detalles de Película (`/[lang]/movie/[id]/page.js`)
- **Título**: Nombre de la película
- **Descripción**: Información sobre horarios y compra de entradas
- **Open Graph**: Tipo `video.movie`, incluye imagen del póster

#### Selección de Asientos (`/[lang]/movie/[id]/session/[time]/page.js`)
- **Título**: "Selecciona tus asientos" (en el idioma correspondiente)
- **Open Graph**: Metadatos básicos

### 2. Open Graph Protocol

Todos los metadatos incluyen propiedades de Open Graph para mejorar la compartición en redes sociales:

```javascript
openGraph: {
  title: '...',
  description: '...',
  locale: lang,        // es, en, fr
  type: 'website',     // o 'video.movie' para películas
  siteName: 'UNIR Cinema',
  images: [...]        // En páginas de películas
}
```

### 3. Internacionalización de Metadatos

Se han añadido secciones de `metadata` en los diccionarios de traducción para cada idioma:

- `src/lib/i18n/dictionaries/es.json`
- `src/lib/i18n/dictionaries/en.json`
- `src/lib/i18n/dictionaries/fr.json`

Ejemplo de estructura:
```json
{
  "metadata": {
    "home": {
      "title": "UNIR Cinema - Tu destino cinematográfico",
      "description": "Descubre la mejor experiencia cinematográfica..."
    },
    "billboard": {
      "title": "Cartelera",
      "description": "Consulta la cartelera de cine en %city%..."
    },
    "movie": {
      "description": "Consulta horarios y compra entradas para %title%..."
    },
    "session": {
      "title": "Selecciona tus asientos"
    }
  }
}
```

### 4. Archivo robots.txt (`/src/app/robots.js`)

Configuración para controlar el rastreo de motores de búsqueda:

**Páginas BLOQUEADAS (no rastreables):**
- `/api/*` - Endpoints de API
- `/*/admin` - Panel de administración
- `/*/profile` - Perfiles de usuario
- `/*/auth-callback` - Callbacks de autenticación
- `/*/movie/*/session/*` - Páginas de selección de asientos

**Páginas PERMITIDAS:**
- Todas las demás rutas públicas

### 5. Sitemap Dinámico (`/src/app/sitemap.js`)

Generación automática del sitemap con las siguientes URLs indexadas:

**Páginas incluidas:**
- Landing page en cada idioma (`/es`, `/en`, `/fr`)
- Carteleras por ciudad en cada idioma:
  - `/es/cartelera/madrid`, `/en/cartelera/madrid`, `/fr/cartelera/madrid`
  - `/es/cartelera/barcelona`, `/en/cartelera/barcelona`, `/fr/cartelera/barcelona`
  - `/es/cartelera/valencia`, `/en/cartelera/valencia`, `/fr/cartelera/valencia`
  - `/es/cartelera/sevilla`, `/en/cartelera/sevilla`, `/fr/cartelera/sevilla`

**Características del sitemap:**
- `changeFrequency: 'daily'` - Actualización diaria
- `priority: 1.0` para landing, `0.8` para carteleras
- `alternates.languages` - Enlaces hreflang para cada idioma

**Páginas NO incluidas (por diseño):**
- Páginas de detalles de película
- Páginas de selección de asientos
- Páginas de perfil/admin/auth

## 🔧 Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `src/lib/i18n/dictionaries/es.json` | Añadida sección `metadata` |
| `src/lib/i18n/dictionaries/en.json` | Añadida sección `metadata` |
| `src/lib/i18n/dictionaries/fr.json` | Añadida sección `metadata` |
| `src/app/[lang]/(main)/page.js` | Añadido `generateMetadata` |
| `src/app/[lang]/(main)/cartelera/[city]/page.js` | Añadido `generateMetadata` |
| `src/app/[lang]/(main)/movie/[id]/page.js` | Añadido `generateMetadata` |
| `src/app/[lang]/(main)/movie/[id]/session/[time]/page.js` | Añadido `generateMetadata` |
| `src/app/robots.js` | Nuevo archivo - configuración robots.txt |
| `src/app/sitemap.js` | Reemplazado - sitemap dinámico optimizado |

## 📈 Beneficios SEO

1. **Mejor indexación**: Los motores de búsqueda pueden entender mejor el contenido de cada página
2. **Compartición social optimizada**: Open Graph mejora la visualización al compartir en redes sociales
3. **Soporte multiidioma**: Los metadatos cambian según el idioma del usuario
4. **Control de rastreo**: Páginas privadas y de sesión no son indexadas
5. **Sitemap optimizado**: Solo las páginas relevantes para SEO están indexadas
