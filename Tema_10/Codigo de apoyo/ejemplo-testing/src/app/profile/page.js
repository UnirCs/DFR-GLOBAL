// app/profile/page.js (Server Component síncrono con cookies)
import { cookies } from "next/headers";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value || "light";

  return (
    <main data-theme={theme}>
      <h1>Perfil</h1>
      <p>Tu tema actual es: {theme}</p>
    </main>
  );
}
