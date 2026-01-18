// src/lib/cinemas-store.js
// Simulación de un store de cines (en un caso real sería una base de datos)

let cinemas = [
  { id: 1, name: "Cine Centro" },
  { id: 2, name: "Cine Sur" },
];

let nextId = 3;

export async function listCinemas() {
  // Simulamos una operación asíncrona
  return Promise.resolve([...cinemas]);
}

export async function createCinema({ name }) {
  const newCinema = { id: nextId++, name };
  cinemas.push(newCinema);
  return Promise.resolve(newCinema);
}

// Para resetear el store en tests
export function resetStore() {
  cinemas = [
    { id: 1, name: "Cine Centro" },
    { id: 2, name: "Cine Sur" },
  ];
  nextId = 3;
}
