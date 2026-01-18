// app/cinemas/page.js (Server Component asíncrono)
import { getCinemas } from "@/src/lib/cinemas";

export default async function CinemasPage() {
  const cinemas = await getCinemas();

  return (
    <main>
      <h1>Cines</h1>
      <ul>
        {cinemas.map((c) => (
          <li key={c.id}>{c.name}</li>
        ))}
      </ul>
    </main>
  );
}
