// src/lib/cinemas.js
// Función asíncrona para obtener la lista de cines desde una API externa
export async function getCinemas() {
  const res = await fetch("https://api.example.com/cinemas", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch cinemas");
  return res.json();
}
