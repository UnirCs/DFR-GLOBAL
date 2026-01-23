# UNIR Cinema - SSG (Static Site Generation) e ISR (Incremental Static Regeneration)

Este proyecto demuestra la implementación de **estrategias de renderizado estático** en Next.js, diferenciando claramente entre:

- **SSG puro**: Páginas completamente estáticas generadas en build time
- **ISR real**: Páginas estáticas que se regeneran periódicamente (`export const revalidate`)
- **Cache de datos**: Cacheo a nivel de fetch individual (NO regenera la página)

---

## 🟢 SSG - Static Site Generation

### ¿Qué es SSG?

**Static Site Generation** es una estrategia donde las páginas se generan como HTML estático durante el **build time**. Esto significa:

- ⚡ **Máximo rendimiento**: El HTML ya está generado, solo se sirve
- 💰 **Bajo costo**: Se puede servir desde CDN sin servidor
- 📦 **Archivos en**: `.next/server/app/[ruta]/page.html`

### Páginas SSG en esta aplicación

Estas páginas se generan **una sola vez** en build y no cambian hasta el próximo build:

| Página        | Ruta          | Estrategia |
|---------------|---------------|------------|
| **About**     | `/about`      | SSG implícito (sin datos) |
| **Not Found** | `/_not-found` | SSG implícito (sin datos) |
| **Admin**     | `/admin`      | SSG implícito (sin datos) |
| **Login**     | `/login`      | SSG implícito (sin datos) |
| **Cinema Madrid** | `/cinema/madrid` | `generateStaticParams` |
| **Cinema Barcelona** | `/cinema/barcelona` | `generateStaticParams` |
| **Cinema Valencia** | `/cinema/valencia` | `generateStaticParams` |
| **Cinema Sevilla** | `/cinema/sevilla` | `generateStaticParams` |

### SSG con generateStaticParams

Para rutas dinámicas (`[city]`), usamos `generateStaticParams` para pre-generar todas las variantes en build time:

```jsx
// src/app/(main)/cinema/[city]/page.js

// Pre-genera todas las rutas en build time
export async function generateStaticParams() {
  const cinemas = await getCinemas();
  return cinemas.map((cinema) => ({
    city: cinema.toLowerCase(),
  }));
}

export default async function CinemaDetailPage({ params }) {
  const { city } = await params;
  // ... renderizar información del cine
}
```

**¿Por qué SSG para `/cinema/[city]`?**
- 📋 La información de los cines (dirección, teléfono, servicios) rara vez cambia
- 🏗️ Se conocen todas las ciudades de antemano
- ⚡ No hay necesidad de regeneración frecuente

---

## ⚡ ISR - Incremental Static Regeneration

### ¿Qué es ISR?

**Incremental Static Regeneration** combina lo mejor de SSG y SSR:

- 📄 Se genera HTML estático inicial en build time
- ⏰ Se **regenera automáticamente** después de un tiempo definido
- 🔄 La siguiente petición tras expirar el cache obtiene datos frescos
- 📦 **Archivo en**: `.next/server/app/.../page.html` (se reemplaza)

### Configuración de ISR Real

```jsx
// src/app/(main)/page.js

// ⚡ ISR REAL: Regenera TODA la página cada 15 segundos
export const revalidate = 15;

export default async function HomePage() {
  const metrics = await getMetrics();  // Se regenera con la página
  // ...
}
```

### Página con ISR en esta aplicación

La **landing page** (`/`) es el único ejemplo de ISR auténtico:

```jsx
// src/app/(main)/page.js

// ⚡ ISR REAL: Regenera toda la página cada 15 segundos
export const revalidate = 15;

export default async function HomePage() {
  const cinemas = await getCinemas();      // force-cache (permanente)
  const metrics = await getMetrics();       // Se regenera con ISR (15s)
  const topMovies = await getTopMovies();   // Cache propio (30s)
  // ...
}
```

### Datos mostrados en la landing (ISR):

1. **Métricas del cine** (se regeneran cada 15s):
   - Entradas vendidas hoy
   - Entradas vendidas este mes
   - Minutos de visualización del año
   - Valoración media

2. **Películas top** (cache de datos propio - 30s):
   - Top 3 películas mejor valoradas
   - Con imagen, título, género y rating

---

## 🔴 IMPORTANTE: ISR Real vs Cache de Datos

### ⚡ ISR Real

El ISR **auténtico** regenera **toda la página HTML** de forma periódica:

**Características:**
- ✅ Se configura con `export const revalidate = X` en la página
- ✅ Regenera el **HTML completo** de la página
- ✅ Todos los datos de la página se actualizan juntos
- ✅ El archivo `.html` en `.next/server/` se reemplaza
- ✅ Primera visita tras expirar: sirve stale, regenera en background

### 📦 Cache de Datos (NO es ISR)

El cache de datos **solo cachea una petición específica**, no regenera la página:

```jsx
// src/lib/api.js
export async function getTopMovies() {
  const response = await fetch(`${API_BASE_URL}/api/v1/movies?rating=top`, {
    next: {
      revalidate: 30,  // Cache de datos: solo esta petición
      tags: ['top-movies']
    }
  });
  return response.json();
}
```

**Características:**
- ⚠️ Se configura en cada `fetch` con `next: { revalidate: X }`
- ⚠️ **NO regenera la página**, solo cachea esos datos específicos
- ⚠️ Útil en páginas dinámicas (SSR) para evitar llamadas repetidas
- ⚠️ Cada fetch puede tener su propio tiempo de revalidación

### 📊 Comparativa

| Aspecto | ISR Real | Cache de Datos |
|---------|----------|----------------|
| **Configuración** | `export const revalidate` | `next: { revalidate }` en fetch |
| **Alcance** | Página completa | Una petición específica |
| **Regeneración** | HTML completo nuevo | Solo actualiza datos cacheados |
| **Uso típico** | Páginas estáticas con datos actualizables | Páginas dinámicas con datos cacheables |
| **Archivo generado** | `.next/server/app/.../page.html` | `.next/cache/fetch-cache/` |

---

## 🔵 Páginas Dinámicas con Cache de Datos

Estas páginas son **SSR** (se renderizan en cada request), pero usan cache de datos para optimizar:

| Página | Ruta | Cache de datos |
|--------|------|----------------|
| **Cartelera** | `/cartelera/[city]` | Sesiones: 15s, Películas: 30s |
| **Película** | `/movie/[id]` | Detalles: 30s |
| **Sesión** | `/movie/[id]/session/[time]` | Sesiones: 15s |

⚠️ **NOTA**: Estas páginas **NO son ISR**. Son dinámicas (SSR) con datos cacheados.

---

## 📁 Ubicación de archivos estáticos generados

```
.next/
├── server/
│   └── app/
│       └── (main)/
│           ├── page.html                    # ⚡ Landing (ISR real - 15s)
│           ├── about/
│           │   └── page.html                # 🟢 About (SSG puro)
│           └── cinema/
│               ├── madrid/
│               │   └── page.html            # 🟢 SSG con generateStaticParams
│               ├── barcelona/
│               │   └── page.html            # 🟢 SSG con generateStaticParams
│               ├── valencia/
│               │   └── page.html            # 🟢 SSG con generateStaticParams
│               └── sevilla/
│                   └── page.html            # 🟢 SSG con generateStaticParams
└── cache/
    └── fetch-cache/                         # 📦 Cache de datos de fetches
```

---

## 📊 Estrategias de Cache en detalle

| Función | Tipo | Configuración | Descripción |
|---------|------|---------------|-------------|
| `getCinemas()` | Permanente | `cache: 'force-cache'` | Lista de cines |
| `getMetrics()` | ISR real | Se invalida con `revalidate` de página | Métricas globales |
| `getTopMovies()` | Cache datos | `next: { revalidate: 30 }` | Top películas |
| `getCinemaMovieSessions()` | Cache datos | `next: { revalidate: 15 }` | Sesiones |
| `getMovieDetails()` | Cache datos | `next: { revalidate: 30 }` | Detalles película |
| `loginUser()` | Sin cache | `cache: 'no-store'` | Autenticación |

---

## 🏗️ Arquitectura del Proyecto

```
┌────────────────────────────────────────────────────────────────┐
│              SSG PURO (Build Time - No regenera)               │
├────────────────────────────────────────────────────────────────┤
│  /about                      → Página estática sin datos       │
│  /cinema/madrid              → generateStaticParams            │
│  /cinema/barcelona           → generateStaticParams            │
│  /cinema/valencia            → generateStaticParams            │
│  /cinema/sevilla             → generateStaticParams            │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│              ISR REAL (export const revalidate)                │
├────────────────────────────────────────────────────────────────┤
│  /                           → Landing con métricas            │
│                                revalidate = 15 segundos        │
│                                (regenera HTML completo)        │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│              SSR + CACHE DE DATOS (No es ISR)                  │
├────────────────────────────────────────────────────────────────┤
│  /cartelera/[city]           → SSR dinámico                    │
│                                + cache de sesiones (15s)       │
│                                + cache de películas (30s)      │
│                                                                │
│  /movie/[id]                 → SSR dinámico                    │
│                                + cache de detalles (30s)       │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│                    CLIENTE (CSR)                                │
├────────────────────────────────────────────────────────────────┤
│  AuthContext, GlobalContext  → Estado de la aplicación         │
│  Header                      → Interactividad                  │
│  login/page.js               → Formulario de login             │
└────────────────────────────────────────────────────────────────┘
```

---

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── globals.css               # Estilos globales + animaciones
│   ├── layout.js                 # 🔵 SSR - Layout raíz
│   ├── providers.js              # 🟢 CSR - Proveedores de contexto
│   └── (main)/
│       ├── layout.js             # 🔵 SSR - Layout principal
│       ├── page.js               # ⚡ ISR - Landing (revalidate: 15)
│       ├── about/
│       │   └── page.js           # 🟢 SSG - Página about
│       ├── cinema/[city]/
│       │   └── page.js           # 🟢 SSG - Info cine (generateStaticParams)
│       ├── cartelera/[city]/
│       │   ├── page.js           # 🔵 SSR + Cache datos
│       │   └── loading.js        # Skeleton loading
│       ├── movie/[id]/
│       │   ├── page.js           # 🔵 SSR + Cache datos
│       │   └── session/[time]/
│       │       └── page.js       # 🔵 SSR + Cache datos
│       ├── login/
│       │   └── page.js           # 🟢 CSR - Formulario login
│       └── admin/
│           └── page.js           # 🟢 CSR - Panel admin
└── lib/
    ├── api.js                    # Funciones fetch con estrategias de cache
    └── actions.js                # Server Actions
```

**Leyenda:**
- 🟢 SSG = Static Site Generation (build time, no regenera)
- ⚡ ISR = Incremental Static Regeneration real (`export const revalidate`)
- 🔵 SSR = Server-Side Rendering (request time, con o sin cache de datos)
- 🟢 CSR = Client-Side Rendering

---

## 🚀 Instalación y Uso

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build de producción (genera páginas estáticas)
npm run build

# Ver el output del build
ls -la .next/server/app/\(main\)/

# Iniciar en producción
npm start
```

---

## 🔍 Verificar en el Build

Tras ejecutar `npm run build`:

```
Route (app)                     Revalidate
┌ ○ /                                  15s     ← ISR (revalidate: 15)
├ ○ /about                                     ← SSG puro
├ ● /cinema/[city]                             ← SSG (generateStaticParams)
│   ├ /cinema/madrid
│   ├ /cinema/barcelona
│   ├ /cinema/valencia
│   └ /cinema/sevilla
├ ƒ /cartelera/[city]                          ← SSR + cache datos
└ ƒ /movie/[id]                                ← SSR + cache datos

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand
```

---

## 🔗 Referencias

- [Next.js Static Site Generation](https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic-rendering)
- [generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
- [Incremental Static Regeneration](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [Data Fetching and Caching](https://nextjs.org/docs/app/building-your-application/data-fetching/caching-and-revalidating)
- [Understanding Incremental Static Regeneration (ISR) Guide](https://www.buildwithmatija.com/blog/understanding-incremental-static-regeneration-isr-guide)

