# UNIR Cinema - Route Handlers API

Este proyecto forma parte de la serie **UNIR Cinema**, una aplicación de gestión de cines que se construye fase a fase. En esta fase, la aplicación deja de depender de una API externa y **implementa sus propios Route Handlers** para servir los datos internamente.

> **Nota sobre persistencia**: Actualmente se utiliza un almacén en memoria (`Map`) para simular la base de datos. En futuras fases se integrará con una base de datos real.

---

## 🔌 Route Handlers - API Interna

### ¿Qué son los Route Handlers?

Los **Route Handlers** son la forma de crear endpoints de API en Next.js App Router. Permiten manejar peticiones HTTP directamente en el servidor, sin necesidad de un backend externo.

### Características principales:

- Se definen en archivos `route.js` dentro de `app/api/`
- Soportan métodos HTTP: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, etc.
- Utilizan la API estándar de `Request` y `Response` de Web Standards
- Se ejecutan exclusivamente en el servidor
- Pueden coexistir con las páginas de la aplicación

### Ubicación en el proyecto

```
src/app/api/v1/
├── _store.js                        # Almacén de datos en memoria (privado)
├── cinemas/
│   ├── route.js                     # GET /api/v1/cinemas
│   └── [cinema]/
│       └── movies/
│           └── route.js             # GET /api/v1/cinemas/:cinema/movies
├── movies/
│   ├── route.js                     # GET /api/v1/movies
│   └── [idMovie]/
│       └── route.js                 # GET /api/v1/movies/:idMovie
├── sessions/
│   └── route.js                     # POST /api/v1/sessions (login)
└── metrics/
    └── route.js                     # GET /api/v1/metrics
```

> **Convención**: Los archivos que comienzan con `_` (como `_store.js`) son módulos privados y **no se exponen como endpoints**.

---

## 📡 Endpoints Implementados

### 1. `/api/v1/cinemas` - Lista de Cines

📁 **Archivo:** `src/app/api/v1/cinemas/route.js`

#### `GET /api/v1/cinemas`

Devuelve la lista de ciudades donde hay cines disponibles.

**Respuesta exitosa (200):**
```json
["Madrid", "Barcelona", "Sevilla", "Valencia"]
```

**Uso en la aplicación:**
- Poblar el selector de cines en el header
- Generar rutas estáticas con `generateStaticParams`

---

### 2. `/api/v1/cinemas/[cinema]/movies` - Sesiones por Cine

📁 **Archivo:** `src/app/api/v1/cinemas/[cinema]/movies/route.js`

#### `GET /api/v1/cinemas/:cinema/movies`

Obtiene las sesiones de películas disponibles para un cine específico.

| Parámetro | Tipo   | Descripción                    |
|-----------|--------|--------------------------------|
| `cinema`  | string | Nombre de la ciudad (case-insensitive) |

**Ejemplo:** `GET /api/v1/cinemas/madrid/movies`

**Respuesta exitosa (200):**
```json
[
  { "id": 1, "showtimes": ["16:00", "19:30", "22:45"], "format": "3d" },
  { "id": 2, "showtimes": ["15:30", "18:15", "21:00"], "format": "imax" },
  { "id": 3, "showtimes": ["17:00", "20:00", "23:00"], "format": "hdfr" }
]
```

**Error (404):**
```json
{ "error": "Cine no encontrado" }
```

**Detalles de implementación:**
- Validación case-insensitive del nombre del cine
- Devuelve solo IDs de películas con horarios y formato

---

### 3. `/api/v1/movies` - Catálogo de Películas

📁 **Archivo:** `src/app/api/v1/movies/route.js`

#### `GET /api/v1/movies`

Obtiene todas las películas en formato resumido.

**Respuesta exitosa (200):**
```json
[
  {
    "id": 1,
    "title": "El retorno del animal",
    "genre": "Ciencia Ficción",
    "duration": "169 min",
    "rating": 4.9,
    "poster": "/film-poster.jpg",
    "director": "Christopher Nolan",
    "year": 2014
  }
]
```

#### `GET /api/v1/movies?rating=top`

Obtiene las películas ordenadas por mejor valoración.

| Parámetro Query | Valor | Descripción                         |
|-----------------|-------|-------------------------------------|
| `rating`        | `top` | Ordena por rating de mayor a menor  |

**Uso en la aplicación:**
- Mostrar el "Top películas" en la página principal

---

### 4. `/api/v1/movies/[idMovie]` - Detalle de Película

📁 **Archivo:** `src/app/api/v1/movies/[idMovie]/route.js`

#### `GET /api/v1/movies/:idMovie`

Obtiene los detalles completos de una película.

| Parámetro | Tipo   | Descripción           |
|-----------|--------|-----------------------|
| `idMovie` | number | ID de la película     |

**Ejemplo:** `GET /api/v1/movies/1`

**Respuesta exitosa (200):**
```json
{
  "id": 1,
  "title": "El retorno del animal",
  "genre": "Ciencia Ficción",
  "duration": "169 min",
  "rating": "4.9/10",
  "synopsis": "Una épica aventura que desafía los límites...",
  "image": "/film-poster.jpg",
  "director": "Christopher Nolan",
  "cast": ["Leonardo DiCaprio", "Marion Cotillard", "Tom Hardy"],
  "year": 2014
}
```

**Error (404):**
```json
{ "error": "Película no encontrada" }
```

---

### 5. `/api/v1/sessions` - Autenticación

📁 **Archivo:** `src/app/api/v1/sessions/route.js`

#### `POST /api/v1/sessions`

Autentica un usuario y devuelve sus datos de sesión.

**Body requerido:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Usuarios válidos:**
| Usuario   | Contraseña  | Rol     |
|-----------|-------------|---------|
| `admin`   | `admin123`  | admin   |
| `user`    | `user123`   | user    |

**Respuesta exitosa (200):**
```json
{
  "username": "admin",
  "name": "Administrador",
  "role": "admin",
  "token": "fake-jwt-token-1705234567890"
}
```

**Error de credenciales (401):**
```json
{ "error": "Credenciales inválidas" }
```

**Error de servidor (500):**
```json
{ "error": "Error en el servidor de autenticación" }
```

---

### 6. `/api/v1/metrics` - Métricas del Sistema

📁 **Archivo:** `src/app/api/v1/metrics/route.js`

#### `GET /api/v1/metrics`

Devuelve métricas globales del sistema de cines.

**Respuesta exitosa (200):**
```json
{
  "ticketsSoldToday": 150000,
  "ticketsSoldMonth": 38542,
  "minutesWatchedYear": 125400000,
  "averageRating": 4.3,
  "activeScreenings": 24,
  "totalCustomers": 892341,
  "updatedAt": "2026-01-14T10:30:00.000Z"
}
```

**Uso en la aplicación:**
- Mostrar estadísticas en la landing page

---

## 💾 Almacén de Datos (`_store.js`)

El archivo `_store.js` simula una base de datos usando un `Map` de JavaScript:

```javascript
const store = new Map();

// Datos disponibles:
store.set("movies", [...]);       // Catálogo de películas
store.set("cinemas", [...]);      // Lista de ciudades con cines
store.set("cinemaMovies", {...}); // Sesiones por cine
store.set("metrics", {...});      // Métricas del sistema
```

### Estructura de datos

#### Películas (detalle completo)
```javascript
{
  id: 1,
  title: "El retorno del animal",
  genre: "Ciencia Ficción",
  duration: "169 min",
  rating: "4.9/10",
  synopsis: "Una épica aventura...",
  image: "/film-poster.jpg",
  poster: "/film-poster.jpg",
  director: "Christopher Nolan",
  cast: ["Leonardo DiCaprio", "Marion Cotillard", "Tom Hardy"],
  year: 2014
}
```

#### Sesiones por cine
```javascript
{
  Madrid: [
    { id: 1, showtimes: ["16:00", "19:30", "22:45"], format: "3d" },
    { id: 2, showtimes: ["15:30", "18:15", "21:00"], format: "imax" }
  ],
  Barcelona: [...]
}
```

---

## 🔗 Consumo de la API (`lib/api.js`)

La aplicación consume los Route Handlers a través de funciones en `lib/api.js` que implementan diferentes estrategias de cache:

| Función | Endpoint | Estrategia de Cache |
|---------|----------|---------------------|
| `getCinemas()` | `/api/v1/cinemas` | `force-cache` (permanente) |
| `getMetrics()` | `/api/v1/metrics` | Sin cache propio (usa ISR de página) |
| `getTopMovies()` | `/api/v1/movies?rating=top` | `revalidate: 30` + tags |
| `getMovieDetails(id)` | `/api/v1/movies/:id` | `revalidate: 10` + tags |
| `getCinemaMovieSessions(city)` | `/api/v1/cinemas/:city/movies` | `revalidate: 15` + tags |
| `loginUser(user, pass)` | `/api/v1/sessions` | `no-store` (sin cache) |

### Ejemplo de consumo

```javascript
// lib/api.js
export async function getCinemas() {
  const response = await fetch(`${API_BASE_URL}/cinemas`, {
    cache: 'force-cache',
    next: { tags: ['cinemas'] }
  });
  return response.json();
}
```

### Acceso directo al Store

Para funciones que se ejecutan en **build time** (como `generateStaticParams`), se proporciona acceso directo al store:

```javascript
import store from '@/app/api/v1/_store';

export function getCinemasFromStore() {
  return store.get('cinemas') || [];
}

export function getMoviesFromStore() {
  return store.get('movies') || [];
}
```

> **¿Por qué?** Durante el build, no hay servidor corriendo y las URLs relativas (`/api/v1/...`) no funcionan.

---

## 🚀 Instalación y Uso

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build de producción
npm run build

# Producción
npm start
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🧪 Probar la API

Puedes probar los endpoints con `curl`:

```bash
# Listar cines
curl http://localhost:3000/api/v1/cinemas

# Películas top
curl http://localhost:3000/api/v1/movies?rating=top

# Detalle de película
curl http://localhost:3000/api/v1/movies/1

# Sesiones de un cine
curl http://localhost:3000/api/v1/cinemas/madrid/movies

# Métricas
curl http://localhost:3000/api/v1/metrics

# Login
curl -X POST http://localhost:3000/api/v1/sessions \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

---

## 🔗 Referencias

- [Route Handlers Documentation](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) - Documentación oficial
- [Next.js Documentation](https://nextjs.org/docs) - Características y API de Next.js

