import "./globals.css";

export const metadata = {
  title: "Route Handlers - Libros API",
  description: "Ejemplo de Route Handlers en Next.js con API CRUD de libros",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
