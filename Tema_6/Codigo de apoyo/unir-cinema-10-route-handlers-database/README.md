# UNIR Cinema - Integración con Base de Datos PostgreSQL

Este proyecto forma parte de la serie **UNIR Cinema**. En esta fase, la aplicación **sustituye el almacenamiento en memoria (`Map`)** por una **base de datos PostgreSQL real**, manteniendo los mismos Route Handlers pero conectándolos a una persistencia real.

---

## 🔄 Diferencias con la Fase Anterior

### Resumen de cambios

| Aspecto | Fase 09 (Map en memoria) | Fase 10 (PostgreSQL) |
|---------|--------------------------|----------------------|
| **Persistencia** | `Map` de JavaScript | Base de datos PostgreSQL |
| **Datos** | Hardcodeados en `_store.js` | Definidos en `database.sql` |
| **Conexión** | N/A | Pool de conexiones con `pg` |
| **Funciones store** | Síncronas | Asíncronas (`async/await`) |
| **Acceso directo** | `lib/api.js` con import directo | `lib/api-server.js` separado |

### Archivos nuevos

| Archivo | Descripción |
|---------|-------------|
| `database.sql` | Script SQL con esquema y datos seed |
| `src/app/api/v1/_db.js` | Pool de conexiones PostgreSQL |
| `src/lib/api-server.js` | Funciones de acceso directo a BD para Server Components |

### Archivos modificados

| Archivo | Cambios principales |
|---------|---------------------|
| `src/app/api/v1/_store.js` | Funciones ahora son `async` y ejecutan queries SQL |
| `package.json` | Nueva dependencia `pg` |

---

## 🗄️ Base de Datos PostgreSQL

### Configuración

**Variables de entorno** (`.env.local`):
```env
DATABASE_URL=postgresql://unir_user:postgres@localhost:5432/unir_cinema
```

### Esquema de tablas

El archivo `database.sql` define la estructura completa:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     cinemas     │     │      rooms      │     │     movies      │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id              │◄────┤ cinema_id       │     │ id              │
│ city            │     │ id              │     │ title           │
│ slug            │     │ name            │     │ genre           │
│ name            │     │ capacity        │     │ duration_text   │
│ address         │     └─────────────────┘     │ rating_value    │
└─────────────────┘                             │ synopsis        │
        │                                       │ director        │
        │                                       │ casts[]         │
        ▼                                       │ year            │
┌─────────────────┐                             └─────────────────┘
│   screenings    │                                     │
├─────────────────┤                                     │
│ id              │                                     │
│ cinema_id       │◄────────────────────────────────────┘
│ room_id         │              movie_id
│ movie_id        │
│ show_date       │
│ show_time       │
│ format          │
│ base_price      │
└─────────────────┘
        │
        ▼
┌─────────────────┐     ┌─────────────────┐
│     orders      │     │     tickets     │
├─────────────────┤     ├─────────────────┤
│ id              │◄────┤ order_id        │
│ user_id         │     │ screening_id    │
│ status          │     │ seat_label      │
│ total_amount    │     │ price_paid      │
└─────────────────┘     └─────────────────┘
        │
        ▼
┌─────────────────┐
│      users      │
├─────────────────┤
│ id              │
│ username        │
│ email           │
│ role            │
│ name            │
│ password_hash   │
└─────────────────┘
```

### Datos seed

El script incluye datos iniciales:
- **4 cines**: Madrid, Barcelona, Sevilla, Valencia
- **12 películas**: Catálogo completo con detalles
- **4 usuarios**: admin, user, manager, guest
- **Sesiones**: Proyecciones programadas para fecha específica

### Ejecución del script

```bash
# Con Docker
docker exec -i postgres_container psql -U unir_user -d unir_cinema < database.sql

# Localmente
psql -U unir_user -d unir_cinema -f database.sql
```

---

## 🔌 Pool de Conexiones (`_db.js`)

```javascript
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export async function query(text, params) {
  return pool.query(text, params);
}

export async function withTransaction(fn) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
```

**Características:**
- Pool reutilizable de conexiones
- Singleton en desarrollo (evita múltiples pools en hot reload)
- Soporte para transacciones con rollback automático

---

## ⚙️ Runtime: Node.js vs Edge

### ¿Por qué funciona con PostgreSQL?

El paquete `pg` (node-postgres) utiliza APIs nativas de Node.js que **no están disponibles en Edge Runtime**:

- `net` (sockets TCP)
- `tls` (conexiones SSL)
- `dns` (resolución DNS)
- `stream` (streams de Node)

Afortunadamente, **Node.js es el runtime por defecto en Next.js**, por lo que no es necesario declarar explícitamente `export const runtime = "nodejs"` en cada archivo. El proyecto funciona correctamente porque usa el runtime de Node.js automáticamente.

> **Nota:** Solo sería necesario declarar el runtime explícitamente si quisieras usar Edge Runtime con `export const runtime = "edge"`, lo cual NO es compatible con PostgreSQL.

### Comparativa de Runtimes

| Característica | Edge Runtime | Node.js Runtime (por defecto) |
|----------------|--------------|-------------------------------|
| **Arranque** | ~0ms (instantáneo) | ~50-100ms |
| **Ubicación** | CDN global (edge) | Servidor central |
| **APIs Node** | ❌ No disponibles | ✅ Completas |
| **Conexión BD** | ❌ No soportada | ✅ Soportada |
| **Límite memoria** | ~128MB | Sin límite práctico |
| **Límite tiempo** | ~30s | Configurable |
| **Casos de uso** | Auth, redirects, A/B testing | BD, filesystem, cómputo pesado |


---

## 📁 Acceso Directo vs Route Handlers

### El problema

En Server Components, hay **dos formas** de obtener datos:

1. **Vía fetch a Route Handlers**: `fetch('/api/v1/movies')`
2. **Acceso directo a la base de datos**: Importar funciones del store

### ¿Por qué existe `api-server.js`?

El archivo `lib/api-server.js` proporciona funciones que acceden **directamente** a la base de datos, sin pasar por HTTP:

```javascript
// lib/api-server.js
import { getCinemas as getCinemasDB, listMovies } from '@/app/api/v1/_store';

export async function getCinemasFromStore() {
  const cinemas = await getCinemasDB();
  return cinemas.map((c) => c.city);
}

export async function getTopMoviesFromStore() {
  const movies = await listMovies();
  return movies
    .map((movie) => ({ /* mapeo */ }))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);
}
```

### Cuándo usar cada aproximación

| Escenario | Usar | Motivo |
|-----------|------|--------|
| **`generateStaticParams`** | `api-server.js` | No hay servidor HTTP durante build |
| **Server Components (build)** | `api-server.js` | Evita overhead de HTTP |
| **Server Components (runtime)** | `api.js` o `api-server.js` | Ambos funcionan |
| **Client Components** | `api.js` (fetch) | No pueden acceder a BD directamente |
| **Route Handlers** | `_store.js` | Acceso directo interno |

### Diferencia con la fase anterior

| Fase 09 | Fase 10 |
|---------|---------|
| `lib/api.js` contenía las funciones `*FromStore` | `lib/api-server.js` contiene las funciones `*FromStore` |
| Funciones síncronas (`store.get()`) | Funciones asíncronas (`await query()`) |
| Un solo archivo para todo | Separación cliente/servidor clara |

---

## 🔄 Cambios en `_store.js`

### Antes (Map en memoria)
```javascript
const store = new Map();
store.set("movies", [{ id: 1, title: "..." }]);

export function listMovies() {
  return store.get("movies") || [];
}
```

### Ahora (PostgreSQL)
```javascript
import { query } from "./_db";

export async function listMovies() {
  const { rows } = await query(
    `SELECT id, title, genre, duration_text, rating_value, ...
     FROM movies ORDER BY id ASC`
  );
  return rows;
}
```

### Funciones disponibles

| Función | Descripción |
|---------|-------------|
| `getCinemas()` | Lista todos los cines |
| `getCinemaBySlug(slug)` | Busca cine por slug |
| `getCinemaByCity(cityName)` | Busca cine por ciudad (case-insensitive) |
| `getCinemaMoviesToday(cityName)` | Sesiones del día actual |
| `listMovies()` | Lista todas las películas |
| `getMovieById(id)` | Detalles de una película |
| `getCinemaScheduleByDate(slug, date)` | Cartelera por fecha |
| `findUserByUsername(username)` | Busca usuario para auth |
| `createOrderWithTickets({...})` | Crea pedido (transaccional) |

---

## 🗺️ Mapeo de Campos DB → API

La base de datos usa nombres de columnas diferentes a la API:

| Campo DB | Campo API | Descripción |
|----------|-----------|-------------|
| `duration_text` | `duration` | Duración formateada ("169 min") |
| `duration_minutes` | - | Duración en minutos (interno) |
| `rating_text` | `rating` | Rating formateado ("4.9/10") |
| `rating_value` | - | Rating numérico para ordenación |
| `casts` | `cast` | Array de actores |
| `image` | `poster` | URL de la imagen |

Este mapeo se realiza en las funciones de `api-server.js`:

```javascript
export async function getMovieDetailsFromStore(movieId) {
  const movie = await getMovieById(parseInt(movieId, 10));
  return {
    id: movie.id,
    title: movie.title,
    duration: movie.duration_text,  // Mapeo
    rating: movie.rating_text,      // Mapeo
    cast: movie.casts,              // Mapeo
    poster: movie.image,            // Mapeo
    // ...
  };
}
```

---

## 🐳 Docker (PostgreSQL)

Para ejecutar PostgreSQL localmente con Docker:

```bash
# Crear y ejecutar contenedor
docker run --name unir-postgres \
  -e POSTGRES_USER=unir_user \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=unir_cinema \
  -p 5432:5432 \
  -d postgres:15

# Ejecutar script de inicialización
docker exec -i unir-postgres psql -U unir_user -d unir_cinema < database.sql
```

---

## 🚀 Instalación y Uso

```bash
# Instalar dependencias (incluye pg)
npm install

# Asegurar PostgreSQL corriendo con datos seed

# Desarrollo
npm run dev

# Build
npm run build

# Producción
npm start
```

---

## 🔗 Referencias

- [node-postgres (pg)](https://node-postgres.com/) - Cliente PostgreSQL para Node.js
- [Next.js Edge and Node.js Runtimes](https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes)
- [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

