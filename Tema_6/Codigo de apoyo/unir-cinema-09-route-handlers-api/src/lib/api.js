/**
 * API Service con estrategias de cache de Next.js
 *
 * IMPORTANTE: Estas opciones de cache SOLO funcionan en Server Components.
 *
 * Estrategias de caching demostradas:
 * - force-cache: Cachea la respuesta indefinidamente (hasta rebuild)
 * - revalidate: Cachea con revalidación por tiempo (ISR a nivel de fetch)
 * - tags: Permite invalidar cache selectivamente con revalidateTag()
 * - Memoización automática: Next.js deduplica peticiones durante un render
 *
 * NOTA IMPORTANTE sobre ISR vs Cache de datos:
 * - ISR real: Se configura con `export const revalidate = X` en la página
 *   y regenera el HTML estático completo.
 * - Cache de datos: Se configura en cada fetch con `next: { revalidate: X }`
 *   y solo cachea los datos de esa petición específica.
 */

const API_BASE_URL = '/api/v1';

// Flag para habilitar/deshabilitar logs de depuración
const DEBUG_CACHE = true;

function log(message) {
  if (DEBUG_CACHE) {
    console.log(`[API] ${message}`);
  }
}

/**
 * Obtiene métricas globales del cine
 *
 * Esta función se usa en páginas con ISR real (export const revalidate)
 * No necesita configuración de cache propia porque la página controla la revalidación
 */
export async function getMetrics() {
  const start = Date.now();

  const response = await fetch(`${API_BASE_URL}/metrics`);

  const duration = Date.now() - start;
  const cacheStatus = duration < 15 ? 'HIT' : 'MISS';
  log(`GET /metrics - ${duration}ms [${cacheStatus}]`);

  if (!response.ok) {
    throw new Error('Error al obtener métricas');
  }

  return response.json();
}

/**
 * Obtiene las películas mejor valoradas
 *
 * Estrategia: Cache de datos con revalidate de 30 segundos
 * NOTA: Este es un ejemplo de cache a nivel de fetch, NO ISR real.
 * La diferencia es que solo se cachean estos datos específicos,
 * no se regenera toda la página.
 */
export async function getTopMovies() {
  const start = Date.now();

  try {
    const response = await fetch(`${API_BASE_URL}/movies?rating=top`, {
      next: {
        revalidate: 30, // Cache de datos: revalidar cada 30 segundos
        tags: ['top-movies']
      }
    });

    const duration = Date.now() - start;
    const cacheStatus = duration < 15 ? 'HIT' : 'MISS';
    log(`GET /movies?rating=top - ${duration}ms [${cacheStatus}]`);

    if (!response.ok) {
      throw new Error('Error al obtener películas top');
    }

    return response.json();
  } catch (error) {
    log(`GET /movies?rating=top - ERROR: ${error.message}`);
    // Devolver valores por defecto si la API falla
    return [
      {
        id: 1,
        title: "Interstellar",
        genre: "Ciencia Ficción",
        duration: "169 min",
        rating: 4.9,
        poster: "/film-poster.jpg"
      },
      {
        id: 2,
        title: "El Padrino",
        genre: "Drama",
        duration: "175 min",
        rating: 4.8,
        poster: "/film-poster.jpg"
      },
      {
        id: 3,
        title: "Pulp Fiction",
        genre: "Crimen",
        duration: "154 min",
        rating: 4.7,
        poster: "/film-poster.jpg"
      }
    ];
  }
}

/**
 * Obtiene la lista de cines disponibles
 *
 * Estrategia: force-cache (cache permanente)
 */
export async function getCinemas() {
  const start = Date.now();

  const response = await fetch(`${API_BASE_URL}/cinemas`, {
    cache: 'force-cache',
    next: {
      tags: ['cinemas']
    }
  });

  const duration = Date.now() - start;
  // Cache HIT: ~0-10ms | Cache MISS: ~100-500ms | Memoizado: ~0ms
  const cacheStatus = duration < 15 ? 'HIT' : 'MISS';
  log(`GET /cinemas - ${duration}ms [${cacheStatus}]`);

  if (!response.ok) {
    throw new Error('Error al obtener la lista de cines');
  }

  return response.json();
}

/**
 * Obtiene los detalles de una película específica
 *
 * Estrategia: revalidate cada 30 segundos (ISR)
 *
 * IMPORTANTE: Usamos un valor FIJO para que la memoización funcione.
 * Si usáramos un valor dinámico (como secondsUntilMidnight), las opciones
 * del fetch serían diferentes en cada llamada y Next.js no podría memoizar.
 */
export async function getMovieDetails(movieId) {
  const start = Date.now();

  const response = await fetch(`${API_BASE_URL}/movies/${movieId}`, {
    next: {
      revalidate: 10, // valor fijo para permitir memoización - juega con este valor para ver diferencias
      tags: ['movies', `movie-${movieId}`]
    }
  });

  const duration = Date.now() - start;
  const cacheStatus = duration < 15 ? 'HIT/MEMO' : 'MISS';

  // Parsear respuesta para ver cuándo se generó
  const data = await response.json();

  // Si la API devuelve timestamp, lo mostramos. Si no, al menos vemos el tiempo.
  const now = new Date().toLocaleTimeString();
  log(`GET /movies/${movieId} - ${duration}ms [${cacheStatus}] @ ${now}`);

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`Error al obtener la película ${movieId}`);
  }

  return data;
}

/**
 * Obtiene las sesiones de películas para un cine específico
 *
 * Estrategia: revalidate cada 15 segundos
 */
export async function getCinemaMovieSessions(cinemaId) {
  const start = Date.now();

  const response = await fetch(`${API_BASE_URL}/cinemas/${cinemaId}/movies`, {
    next: {
      revalidate: 15, // ISR: revalidar cada 15 segundos
      tags: ['sessions', `cinema-${cinemaId}-sessions`]
    }
  });

  const duration = Date.now() - start;
  // Cache HIT: ~0-10ms | Cache MISS: ~100-500ms | Memoizado: ~0ms
  const cacheStatus = duration < 15 ? 'HIT' : 'MISS';
  log(`GET /cinemas/${cinemaId}/movies - ${duration}ms [${cacheStatus}]`);

  if (!response.ok) {
    throw new Error(`Error al obtener sesiones del cine ${cinemaId}`);
  }

  return response.json();
}

/**
 * Obtiene los datos completos de películas para un cine
 *
 * Combina datos de sesiones + detalles de cada película.
 *
 * MEMOIZACIÓN: Usamos un bucle secuencial (for...of) en lugar de Promise.all
 * para que Next.js pueda memoizar las llamadas duplicadas. Cuando la primera
 * llamada a getMovieDetails(4) termina, la segunda llamada con el mismo ID
 * será servida desde la memoización (~0ms).
 *
 * NOTA: Esto es PEOR para performance (peticiones secuenciales vs paralelas),
 * pero permite demostrar cómo funciona la memoización de Next.js.
 */
export async function getCinemaMoviesWithDetails(cinemaId) {
  log(`getCinemaMoviesWithDetails("${cinemaId}")`);

  const sessions = await getCinemaMovieSessions(cinemaId);

  // Mostrar IDs para ver dónde aplica memoización
  const ids = sessions.map(s => s.id);
  const uniqueIds = [...new Set(ids)];
  if (ids.length !== uniqueIds.length) {
    log(`MEMOIZACION ESPERADA: ${ids.length} sesiones, ${uniqueIds.length} IDs unicos - ${ids.length - uniqueIds.length} llamadas memoizadas`);
  }

  // Bucle secuencial para permitir memoización
  const moviesWithDetails = [];
  for (const session of sessions) {
    const movieDetails = await getMovieDetails(session.id);

    if (movieDetails) {
      moviesWithDetails.push({
        ...movieDetails,
        showtimes: session.showtimes,
        format: session.format
      });
    }
  }

  return moviesWithDetails;
}

/**
 * Realiza el login del usuario
 *
 * Estrategia: no-store (sin cache)
 * - Operaciones de autenticación siempre deben ejecutarse
 * - Datos sensibles y específicos del usuario
 */
export async function loginUser(username, password) {
  const response = await fetch(`${API_BASE_URL}/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
    cache: 'no-store'
  });

  if (response.status === 401) {
    throw new Error('Credenciales inválidas');
  }

  if (!response.ok) {
    throw new Error('Error en el servidor de autenticación');
  }

  return response.json();
}

// ============================================================================
// FUNCIONES DE ACCESO DIRECTO AL STORE (para build time / generateStaticParams)
// ============================================================================
// Estas funciones acceden directamente al store sin hacer fetch.
// Son necesarias porque durante el build (generateStaticParams) no hay
// servidor corriendo y las URLs relativas no funcionan.
// ============================================================================

import store from '@/app/api/v1/_store';

/**
 * Obtiene la lista de cines directamente del store
 * Usar en generateStaticParams o cuando no hay servidor disponible
 */
export function getCinemasFromStore() {
  return store.get('cinemas') || [];
}

/**
 * Obtiene las películas directamente del store
 * Usar en generateStaticParams o cuando no hay servidor disponible
 */
export function getMoviesFromStore() {
  return store.get('movies') || [];
}

/**
 * Obtiene las sesiones de un cine directamente del store
 * Usar en generateStaticParams o cuando no hay servidor disponible
 */
export function getCinemaMoviesFromStore(cinemaId) {
  const cinemaMovies = store.get('cinemaMovies') || {};
  const cinemas = store.get('cinemas') || [];

  // Buscar el nombre correcto del cine (case-insensitive)
  const cinemaName = cinemas.find(
    (c) => c.toLowerCase() === cinemaId.toLowerCase()
  );

  return cinemaName ? (cinemaMovies[cinemaName] || []) : [];
}

/**
 * Obtiene el detalle de una película directamente del store
 * Usar en generateStaticParams o cuando no hay servidor disponible
 */
export function getMovieDetailsFromStore(movieId) {
  const movies = store.get('movies') || [];
  return movies.find((m) => m.id === parseInt(movieId, 10)) || null;
}

/**
 * Obtiene las métricas directamente del store
 * Usar durante el build cuando no hay servidor disponible
 */
export function getMetricsFromStore() {
  const metrics = store.get('metrics') || {};
  return {
    ...metrics,
    updatedAt: new Date().toISOString()
  };
}

/**
 * Obtiene las películas top directamente del store (ordenadas por rating)
 * Usar durante el build cuando no hay servidor disponible
 */
export function getTopMoviesFromStore() {
  const movies = store.get('movies') || [];
  return movies
    .map((movie) => ({
      id: movie.id,
      title: movie.title,
      genre: movie.genre,
      duration: movie.duration,
      rating: parseFloat(movie.rating),
      poster: movie.poster,
      director: movie.director,
      year: movie.year
    }))
    .sort((a, b) => b.rating - a.rating);
}

/**
 * Obtiene los datos completos de películas para un cine directamente del store
 * Combina datos de sesiones + detalles de cada película
 */
export function getCinemaMoviesWithDetailsFromStore(cinemaId) {
  const sessions = getCinemaMoviesFromStore(cinemaId);
  const movies = store.get('movies') || [];

  return sessions.map((session) => {
    const movieDetails = movies.find((m) => m.id === session.id);
    if (movieDetails) {
      return {
        ...movieDetails,
        rating: parseFloat(movieDetails.rating),
        showtimes: session.showtimes,
        format: session.format
      };
    }
    return null;
  }).filter(Boolean);
}

