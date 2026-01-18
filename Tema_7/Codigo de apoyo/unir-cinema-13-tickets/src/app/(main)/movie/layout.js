// Server Component - Layout específico para las páginas de películas
// Usa una fuente diferente (Crimson Text) solo para la sección de películas

import { Crimson_Text } from "next/font/google";

// Fuente específica para las páginas de películas - Crimson Text (serif elegante)
// Pesos disponibles para Crimson Text: 400, 600, 700
const crimsonText = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-crimson",
});

export default function MovieLayout({ children }) {
  return (
    <div className={`${crimsonText.variable} ${crimsonText.className} flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full`}>
      {children}
    </div>
  );
}

