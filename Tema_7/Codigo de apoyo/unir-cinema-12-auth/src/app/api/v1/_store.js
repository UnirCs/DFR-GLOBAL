// app/api/_store.js
import { query, withTransaction } from "./_db";

// -----------------------------
// CINEMAS
// -----------------------------
export async function getCinemas() {
  const { rows } = await query(
    `SELECT id, city, slug, name, address
     FROM cinemas
     ORDER BY city ASC`
  );
  return rows;
}

export async function getCinemaBySlug(slug) {
  const { rows } = await query(
    `SELECT id, city, slug, name, address
     FROM cinemas
     WHERE slug = $1`,
    [slug]
  );
  return rows[0] || null;
}

export async function getCinemaByCity(cityName) {
  const { rows } = await query(
    `SELECT id, city, slug, name, address
     FROM cinemas
     WHERE LOWER(city) = LOWER($1)`,
    [cityName]
  );
  return rows[0] || null;
}

// Obtiene las peliculas con sesiones de hoy para un cine (formato legacy)
export async function getCinemaMoviesToday(cityName) {
  const cinema = await getCinemaByCity(cityName);
  if (!cinema) return null;

  const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

  const { rows } = await query(
    `SELECT
        m.id AS movie_id,
        s.show_time,
        s.format
     FROM screenings s
     JOIN movies m ON m.id = s.movie_id
     WHERE s.cinema_id = $1
       AND s.show_date = $2
     ORDER BY m.id ASC, s.show_time ASC`,
    [cinema.id, today]
  );

  // Agrupar por pelicula en formato legacy: { id, showtimes: [], format }
  const byMovie = new Map();

  for (const r of rows) {
    if (!byMovie.has(r.movie_id)) {
      byMovie.set(r.movie_id, {
        id: r.movie_id,
        showtimes: [],
        format: r.format,
      });
    }
    // Formatear show_time como string HH:MM
    const timeStr = r.show_time.substring(0, 5);
    byMovie.get(r.movie_id).showtimes.push(timeStr);
  }

  return Array.from(byMovie.values());
}

// -----------------------------
// MOVIES
// -----------------------------
export async function listMovies() {
  const { rows } = await query(
    `SELECT id, title, genre, duration_text, duration_minutes,
            rating_text, rating_value, synopsis, image, director, casts, year
     FROM movies
     ORDER BY id ASC`
  );
  return rows;
}

export async function getMovieById(id) {
  const { rows } = await query(
    `SELECT id, title, genre, duration_text, duration_minutes,
            rating_text, rating_value, synopsis, image, director, casts, year
     FROM movies
     WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
}

// -----------------------------
// SCREENINGS (cartelera)
// -----------------------------
export async function getCinemaScheduleByDate(cinemaSlug, dateISO) {
  const cinema = await getCinemaBySlug(cinemaSlug);
  if (!cinema) return null;

  // dateISO esperado en formato 'YYYY-MM-DD'
  const { rows } = await query(
    `SELECT
        s.id AS screening_id,
        s.show_date,
        s.show_time,
        s.format,
        s.base_price,
        m.id AS movie_id,
        m.title,
        m.genre,
        m.duration_text,
        m.duration_minutes,
        m.rating_text,
        m.rating_value,
        m.synopsis,
        m.image,
        m.director,
        m.casts,
        m.year
     FROM screenings s
     JOIN movies m ON m.id = s.movie_id
     WHERE s.cinema_id = $1
       AND s.show_date = $2
     ORDER BY m.id ASC, s.show_time ASC`,
    [cinema.id, dateISO]
  );

  // Agregacion: una pelicula con sus sesiones
  const byMovie = new Map();

  for (const r of rows) {
    if (!byMovie.has(r.movie_id)) {
      byMovie.set(r.movie_id, {
        id: r.movie_id,
        title: r.title,
        genre: r.genre,
        duration_text: r.duration_text,
        duration_minutes: r.duration_minutes,
        rating_text: r.rating_text,
        rating_value: r.rating_value,
        synopsis: r.synopsis,
        image: r.image,
        director: r.director,
        casts: r.casts,
        year: r.year,
        screenings: [],
      });
    }

    byMovie.get(r.movie_id).screenings.push({
      id: r.screening_id,
      showDate: r.show_date,   // Date
      showTime: r.show_time,   // Time
      format: r.format,
      basePrice: Number(r.base_price),
    });
  }

  return {
    cinema,
    date: dateISO,
    movies: Array.from(byMovie.values()),
  };
}

// -----------------------------
// USERS (autenticacion demo)
// -----------------------------
export async function findUserByUsername(username) {
  const { rows } = await query(
    `SELECT id, username, email, role, name, password_hash
     FROM users
     WHERE username = $1`,
    [username]
  );
  return rows[0] || null;
}

export async function findUserByEmail(email) {
  const { rows } = await query(
    `SELECT id, username, email, role, name, password_hash
     FROM users
     WHERE email = $1`,
    [email]
  );
  return rows[0] || null;
}

/**
 * Busca un usuario por email. Si no existe, lo crea con los datos de Auth0.
 * @param {object} auth0Profile - Perfil de Auth0 { email, name }
 * @returns {object} Usuario existente o recien creado
 */
export async function findOrCreateUserFromAuth0(auth0Profile) {
  const { email, name } = auth0Profile;
  console.log("[STORE] findOrCreateUserFromAuth0:", email, name);

  // Buscar si ya existe
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return existingUser;
  }

  // Crear nuevo usuario (el ID se genera automaticamente por IDENTITY)
  const { rows } = await query(
      `INSERT INTO users (username, email, role, name, password_hash)
       VALUES ($1, $2, $3, $4, $5)
         RETURNING id, username, email, role, name`,
      [email, email, 'user', name, 'Google Sign In']
  );

  return rows[0];
}

// -----------------------------
// ORDERS / TICKETS (operacion transaccional)
// -----------------------------
export async function createOrderWithTickets({ userId, screeningId, seats }) {
  // seats: array de strings tipo ['A1','A2']
  return withTransaction(async (client) => {
    // Leemos precio base de la sesion (podrias aplicar logica de descuentos aqui)
    const screeningRes = await client.query(
      `SELECT id, base_price
       FROM screenings
       WHERE id = $1`,
      [screeningId]
    );

    const screening = screeningRes.rows[0];
    if (!screening) {
      return null;
    }

    const price = Number(screening.base_price);
    const total = price * seats.length;

    const orderRes = await client.query(
      `INSERT INTO orders (user_id, status, total_amount)
       VALUES ($1, 'paid', $2)
       RETURNING id, user_id, status, total_amount, created_at`,
      [userId, total]
    );

    const order = orderRes.rows[0];

    const tickets = [];
    for (const seat of seats) {
      const tRes = await client.query(
        `INSERT INTO tickets (order_id, user_id, screening_id, seat_label, price_paid)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, order_id, user_id, screening_id, seat_label, price_paid, created_at`,
        [order.id, userId, screeningId, seat, price]
      );
      tickets.push(tRes.rows[0]);
    }

    return { order, tickets };
  });
}
