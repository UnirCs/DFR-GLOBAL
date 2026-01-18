// Server Component - Layout raíz de la aplicación
// Este es un Server Component por defecto
// Providers es un Client Component que envuelve la app con los contextos necesarios

import "./globals.css";
import { Providers } from "./providers";
import { Nunito } from "next/font/google";

// Fuente principal de la aplicación - Nunito (no convencional, moderna y legible)
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-nunito",
});

export const metadata = {
  title: "UNIR Cinema - App Router",
  description: "Aplicación de cine desarrollada con Next.js App Router",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={nunito.variable}>
      <body className={nunito.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
