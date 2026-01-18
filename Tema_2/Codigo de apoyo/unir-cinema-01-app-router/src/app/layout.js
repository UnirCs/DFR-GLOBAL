import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "UNIR Cinema - App Router",
  description: "Aplicación de cine desarrollada con Next.js App Router",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
