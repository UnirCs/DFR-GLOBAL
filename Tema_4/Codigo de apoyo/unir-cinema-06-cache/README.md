# UNIR Cinema - Cache de Next.js con Server Components

Este proyecto demuestra la implementación de **estrategias de caché** en Next.js utilizando la API de `fetch` con sus opciones nativas de cache, revalidación y tags en **Server Components**.

## ⚠️ Importante: Cache SOLO funciona en Server Components

**El cache de `fetch` de Next.js (`force-cache`, `revalidate`, `tags`) SOLO funciona en Server Components.**

```javascript
// ✅ Server Component - El cache SÍ funciona
export default async function Page() {
  const data = await fetch(url, { next: { revalidate: 60 } });
}

// ❌ Client Component - El cache NO funciona
'use client';
export default function Page() {
  useEffect(() => {
    fetch(url, { next: { revalidate: 60 } }); // Ignorado por el navegador
  }, []);
}
```

## 🏗️ Arquitectura del Proyecto

Para aprovechar el cache de Next.js, usamos **URL params** y **searchParams** para la ciudad:

```
/                       →  Redirect a /cartelera/madrid
/cartelera/[city]       →  Server Component con cache ✅
/movie/[id]?city=madrid →  Server Component con cache ✅ (ciudad via searchParams)
```

### Selector de Ciudad Global

El selector de ciudad está ubicado en el **Header** y es visible en todas las páginas:

- Al cambiar la ciudad en el selector, si estás en la cartelera, navega automáticamente a `/cartelera/{ciudad}`
- Al navegar a una película, la ciudad se pasa como query param: `/movie/4?city=sevilla`
- El Server Component lee la ciudad del `searchParams` para obtener las sesiones correctas (SSR)

### Flujo de datos:

```
┌──────────────────────────────────────────────────────────────┐
│                    SERVIDOR (Cache activo)                    │
├──────────────────────────────────────────────────────────────┤
│  /cartelera/sevilla                                          │
│    ├── getCinemas()         → force-cache (permanente)       │
│    ├── getCinemaMovieSessions('sevilla') → revalidate: 60s   │
│    └── getMovieDetails(id)  → revalidate: 3600s (1 hora)     │
│                                                              │
│  /movie/4?city=sevilla                                       │
│    ├── getMovieDetails(4)   → revalidate: 3600s (1 hora)     │
│    └── getCinemaMovieSessions('sevilla') → revalidate: 60s   │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                    CLIENTE (Interactividad)                   │
├──────────────────────────────────────────────────────────────┤
│  Header.jsx          → Selector de ciudad + navegación       │
│  CitySyncClient.jsx  → Sincroniza ciudad URL ↔ contexto      │
│  MovieDetailsClient  → Botón volver, enlaces a sesiones      │
│  Pelicula.jsx        → Hover effects, link con ?city=        │
└──────────────────────────────────────────────────────────────┘
```

---

## 🌐 API Simulada

El proyecto consume una API simulada en **Apidog**.

### URL Base
```
https://mock.apidog.com/m1/1172760-1166489-default
```

### Endpoints Disponibles

| Endpoint | Método | Descripción | Cache |
|----------|--------|-------------|-------|
| `/api/v1/cinemas` | GET | Lista de ciudades | `force-cache` |
| `/api/v1/movies/{id}` | GET | Detalles de película | `revalidate: 3600s` |
| `/api/v1/cinemas/{id}/movies` | GET | Sesiones del cine | `revalidate: 60s` |
| `/api/v1/sessions` | POST | Login | `no-store` |

---

## 🗄️ Estrategias de Cache Implementadas

### 1. `force-cache` - Cache Permanente

**Archivo:** `src/lib/api.js` → `getCinemas()`

```javascript
const response = await fetch(`${API_BASE_URL}/api/v1/cinemas`, {
  cache: 'force-cache',
  next: {
    tags: ['cinemas']
  }
});
```

- Cache indefinido hasta el próximo build
- Ideal para datos que raramente cambian
- Invalidación manual con `revalidateTag('cinemas')`

### 2. `revalidate` - Cache con Tiempo

**Archivo:** `src/lib/api.js` → `getCinemaMovieSessions()`

```javascript
const response = await fetch(`${API_BASE_URL}/api/v1/cinemas/${cinemaId}/movies`, {
  next: {
    revalidate: 60,  // Revalidar cada 60 segundos
    tags: ['sessions', `cinema-${cinemaId}-sessions`]
  }
});
```

### 3. `revalidate` fijo - Cache con memoización

**Archivo:** `src/lib/api.js` → `getMovieDetails()`

```javascript
const response = await fetch(`${API_BASE_URL}/api/v1/movies/${movieId}`, {
  next: {
    revalidate: 3600, // 1 hora - valor FIJO para permitir memoización
    tags: ['movies', `movie-${movieId}`]
  }
});
```

> **⚠️ IMPORTANTE:** Usamos un valor **FIJO** en lugar de dinámico (como `secondsUntilMidnight`). 
> Si el valor de `revalidate` cambia en cada llamada, Next.js no puede memoizar porque 
> considera que las opciones del fetch son diferentes.

### 4. `no-store` - Sin Cache

**Archivo:** `src/lib/api.js` → `loginUser()`

```javascript
const response = await fetch(`${API_BASE_URL}/api/v1/sessions`, {
  method: 'POST',
  cache: 'no-store'  // Nunca cachear autenticación
});
```

### 5. Memoización Automática

**La memoización NO es lo mismo que el cache.** Es una deduplicación en memoria durante un único render.

```javascript
// Durante UN render de servidor:
await getMovieDetails(4);  // Petición real
await getMovieDetails(4);  // Memoizado (no hace petición)
await getMovieDetails(5);  // Petición real (diferente ID)
await getMovieDetails(4);  // Memoizado (ya se pidió el ID 4)
```

#### ⚠️ La memoización NO funciona con `Promise.all`

```javascript
// ❌ NO FUNCIONA - Las llamadas se ejecutan en paralelo
await Promise.all([
  getMovieDetails(4),  // Inicia
  getMovieDetails(4),  // Inicia (no espera a que termine la primera)
]);
// Resultado: 2 peticiones reales a /api/v1/movies/4

// ✅ FUNCIONA - Las llamadas son secuenciales
for (const id of [4, 4, 5]) {
  await getMovieDetails(id);
}
// Resultado: 2 peticiones (4 y 5), la segunda llamada a 4 es memoizada
```

> **NOTA:** Usamos un bucle secuencial (`for...of`) en `getCinemaMoviesWithDetails()` 
> para demostrar la memoización. Esto es **peor para performance** pero útil para 
> entender el concepto. En producción, se recomienda deduplicar manualmente los IDs 
> antes de usar `Promise.all`.

**Diferencias:**

| Característica | Cache (`fetch-cache`) | Memoización |
|----------------|----------------------|-------------|
| Persiste en disco | ✅ Sí | ❌ No |
| Sobrevive entre requests | ✅ Sí | ❌ No |
| Alcance | Global | Un render |
| Configuración | Explícita | Automática |
| Funciona con Promise.all | ✅ Sí | ❌ No |

---

## 🏷️ Sistema de Tags para Invalidación

| Tag | Afecta a |
|-----|----------|
| `cinemas` | Lista de cines |
| `movies` | Todos los detalles de películas |
| `movie-{id}` | Película específica |
| `sessions` | Todas las sesiones |
| `cinema-{id}-sessions` | Sesiones de un cine |

**Invalidación (Server Action):**
```javascript
import { revalidateTag } from 'next/cache';

revalidateTag('sessions');        // Invalidar todas las sesiones
revalidateTag('movie-4');         // Invalidar película específica
revalidateTag('cinema-madrid-sessions'); // Invalidar sesiones de Madrid
```

---

## ⏱️ Cómo funciona `revalidate` (Stale-While-Revalidate)

`revalidate: 60` **NO** significa "invalidar la cache después de 60 segundos". Usa la estrategia **Stale-While-Revalidate (SWR)**:

```
0s-60s:   Cache FRESH → Sirve desde cache (HIT)
60s+:     Cache STALE → Sirve desde cache (HIT) + revalida en background
          Siguiente petición → Sirve datos nuevos (HIT con datos actualizados)
```

### Flujo detallado:

| Tiempo | Petición | ¿Qué pasa? | Resultado |
|--------|----------|------------|-----------|
| 0s | Primera | Va a la API | MISS (~200ms) |
| 30s | Segunda | Cache válida | HIT (~2ms) |
| 60s | Tercera | Cache **stale** pero la sirve, revalida en background | HIT (~2ms) |
| 61s | Cuarta | Sirve la nueva versión cacheada | HIT (~2ms) |

> **IMPORTANTE:** Nunca verás MISS después del primero (a menos que invalides manualmente).
> La revalidación ocurre en background y no bloquea la respuesta.

---

## 🗑️ Server Action: Invalidar Cache Manualmente

El proyecto incluye un botón **"Invalidar Cache"** en el Header que permite forzar la invalidación de toda la cache.

**Archivo:** `src/lib/actions.js`

```javascript
'use server';

import { revalidatePath } from 'next/cache';

export async function invalidateAllCache() {
  // Invalida toda la cache desde la raíz
  revalidatePath('/', 'layout');
  
  return { success: true, timestamp: new Date().toISOString() };
}
```

### Cómo probarlo:

1. Carga `/cartelera/madrid` → verás MISS en los logs del servidor
2. Recarga la página → verás HIT (cache funcionando)
3. Haz clic en **"🗑️ Invalidar Cache"** en el Header
4. Recarga la página → verás MISS de nuevo (cache invalidada)

---

## 📊 Sistema de Logs para Detectar Cache HIT/MISS

Las funciones de API incluyen medición de tiempo para detectar si los datos vienen de cache:

```javascript
const start = Date.now();
const response = await fetch(url, { next: { revalidate: 60 } });
const duration = Date.now() - start;

const cacheStatus = duration < 15 ? 'HIT' : 'MISS';
console.log(`GET ${url} - ${duration}ms [${cacheStatus}]`);
```

### Interpretación de los logs:

| Tiempo | Significado |
|--------|-------------|
| `~0-15ms` | **HIT** - Datos desde Data Cache o memoización |
| `~100-500ms` | **MISS** - Petición real a la API |

### Ejemplo de logs en consola:

```
[API] GET /api/v1/cinemas - 245ms [MISS]           ← Primera carga
[API] GET /api/v1/cinemas/madrid/movies - 180ms [MISS]
[API] GET /api/v1/movies/4 - 175ms [MISS]
[API] GET /api/v1/movies/5 - 190ms [MISS]
[API] GET /api/v1/movies/4 - 2ms [HIT/MEMO]        ← Memoizado (mismo render)

--- Recarga de página ---

[API] GET /api/v1/cinemas - 3ms [HIT]              ← Cache funcionando
[API] GET /api/v1/cinemas/madrid/movies - 2ms [HIT]
[API] GET /api/v1/movies/4 - 4ms [HIT/MEMO]
```

---

## 📁 Estructura del Proyecto

```
src/
├── lib/
│   ├── api.js                    # Funciones de fetch con cache
│   └── actions.js                # Server Actions (invalidar cache)
├── context/
│   └── GlobalContext.jsx         # Contexto global (ciudad seleccionada)
├── app/(main)/
│   ├── page.js                   # Redirect a /cartelera/madrid
│   ├── cartelera/[city]/
│   │   ├── page.js               # 🔵 Server Component (cache activo)
│   │   ├── CitySyncClient.jsx    # 🟢 Sincroniza ciudad URL ↔ contexto
│   │   └── MoviesList.jsx        # Server Component (renderiza películas)
│   ├── movie/[id]/
│   │   ├── page.js               # 🔵 Server Component (lee ?city= de searchParams)
│   │   └── MovieDetailsClient.jsx # 🟢 Client Component (interactividad)
│   └── login/page.js             # 🟢 Client Component (formulario)
└── components/
    ├── Header.jsx                # 🟢 Selector de ciudad + invalidar cache
    ├── Pelicula.jsx              # 🟢 Link incluye ?city= para SSR
    └── ...
```

🔵 = Server Component (fetch con cache)
🟢 = Client Component (interactividad)

---

## 🚀 Instalación y Uso

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build de producción (el cache se pre-genera)
npm run build
npm start
```

---

## 🔍 Verificar el Cache

1. Abre DevTools → Network
2. Navega a `/cartelera/madrid`
3. Verás las peticiones iniciales (200)
4. Cambia a otra ciudad (`/cartelera/barcelona`)
5. Vuelve a Madrid - las peticiones deberían venir del cache

**En producción** (`npm run build && npm start`):
- Las peticiones se hacen en el servidor
- El HTML llega pre-renderizado con los datos
- No verás peticiones fetch en el navegador para datos cacheados

---

## 📖 Conceptos Clave

### ¿Por qué URL params en lugar de Context?

| Enfoque | Cache Server | Compartir URL |
|---------|--------------|---------------|
| Context (estado cliente) | ❌ No | ❌ No |
| URL params | ✅ Sí | ✅ Sí |

### Patrón Server + Client Component

```jsx
// page.js - Server Component (carga datos)
export default async function Page({ params }) {
  const data = await fetchWithCache(params.id);  // ✅ Cache activo
  return <ClientComponent data={data} />;
}

// ClientComponent.jsx - Solo interactividad
'use client';
export default function ClientComponent({ data }) {
  // Recibe datos ya cargados, no hace fetch
  return <button onClick={...}>{data.title}</button>;
}
```

---

## 🏙️ Selector de Ciudad Global (SSR)

El selector de ciudad está en el **Header** y funciona con **Server Side Rendering**:

### Flujo de navegación:

```
┌─────────────────────────────────────────────────────────────────┐
│  Header (visible en todas las páginas)                          │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 🎬 UNIR Cinema   [Selector: Sevilla ▼]   Inicio  Nosotros   ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
         Usuario selecciona "Sevilla"
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Si está en /cartelera/madrid:                                  │
│    → router.push('/cartelera/sevilla')                          │
│    → CitySyncClient sincroniza contexto con URL                 │
│                                                                 │
│  Si hace clic en "Ver más detalles" de una película:            │
│    → Navega a /movie/4?city=sevilla                             │
│    → Server Component lee searchParams.city                     │
│    → getCinemaMovieSessions('sevilla') en el SERVIDOR (SSR)     │
└─────────────────────────────────────────────────────────────────┘
```

### Código clave:

**`Pelicula.jsx`** - Enlace incluye ciudad:
```jsx
<Link href={`/movie/${movie.id}?city=${city}`}>
  Ver más detalles
</Link>
```

**`movie/[id]/page.js`** - Server Component lee searchParams:
```javascript
export default async function MovieDetailsPage({ params, searchParams }) {
  const { id: movieId } = await params;
  const { city = 'madrid' } = await searchParams;  // Ciudad del query param

  // Fetch en el servidor con cache (SSR)
  const [movieData, sessionsData] = await Promise.all([
    getMovieDetails(movieId),
    getCinemaMovieSessions(city)  // ✅ Sesiones de la ciudad correcta
  ]);
  // ...
}
```

---

## 🔗 Referencias

- [Next.js Caching](https://nextjs.org/docs/app/building-your-application/caching)
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Server vs Client Components](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)
