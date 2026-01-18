# UNIR Cinema - Imágenes y Fuentes con Next.js

Este proyecto demuestra el uso de **next/image** y **next/font** en Next.js App Router.

## 🎨 Fuentes con `next/font`

Se han implementado dos fuentes de Google Fonts utilizando `next/font/google` para optimización automática.

### Fuente Principal: Nunito

La fuente **Nunito** se aplica como fuente principal de toda la aplicación.

**Ubicación:** `src/app/layout.js`

```javascript
import { Nunito } from "next/font/google";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-nunito",
});

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={nunito.variable}>
      <body className={nunito.className}>
        {/* ... */}
      </body>
    </html>
  );
}
```

### Fuente Secundaria: Crimson Text

La fuente **Crimson Text** (serif elegante) se aplica únicamente a las páginas de películas (`/movie/*`).

**Ubicación:** `src/app/(main)/movie/layout.js`

```javascript
import { Crimson_Text } from "next/font/google";

const crimsonText = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-crimson",
});

export default function MovieLayout({ children }) {
  return (
    <div className={`${crimsonText.variable} ${crimsonText.className}`}>
      {children}
    </div>
  );
}
```

### Variables CSS de Fuentes

Las fuentes están disponibles como variables CSS:
- `--font-nunito` - Fuente principal
- `--font-crimson` - Fuente para sección de películas

---

## 🖼️ Imágenes con `next/image`

Se utiliza el componente `Image` de `next/image` con la propiedad `fill` y `sizes` para imágenes responsivas.

### Lista de Películas

**Ubicación:** `src/components/Pelicula.jsx`

```javascript
import Image from 'next/image';

const Pelicula = ({ movie, priority = false }) => {
  return (
    <div className="movie">
      <div className="movie-poster-container">
        <Image
          src="/film-poster.jpg"
          alt={`Poster de ${movie.title}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
          style={{ objectFit: 'cover' }}
        />
      </div>
      {/* ... resto del contenido */}
    </div>
  );
};
```

**Características:**
- `fill`: La imagen llena su contenedor padre (requiere `position: relative` en el padre)
- `sizes`: Define tamaños responsivos para diferentes viewports
- `priority`: Las primeras 2 películas tienen `priority={true}` para optimizar LCP

### Página de Detalles de Película

**Ubicación:** `src/app/(main)/movie/[id]/page.js`

```javascript
import Image from 'next/image';

<div className="movie-detail-poster">
  <Image
    src="/film-poster.jpg"
    alt={`Poster de ${movie.title}`}
    fill
    sizes="(max-width: 768px) 100vw, 400px"
    priority
    style={{ objectFit: 'cover' }}
  />
</div>
```

**Características:**
- `priority={true}`: Siempre activo ya que es contenido above-the-fold
- `sizes`: 100vw en móvil, 400px en desktop

---

## 📁 Estructura de Archivos Modificados

```
src/
├── app/
│   ├── layout.js              # Fuente Nunito (principal)
│   ├── globals.css            # Estilos para contenedores de imágenes
│   └── (main)/
│       ├── page.js            # Priority en primeras películas
│       └── movie/
│           ├── layout.js      # Fuente Crimson Text (secundaria)
│           └── [id]/
│               └── page.js    # Imagen con priority
├── components/
│   └── Pelicula.jsx           # Imagen con fill y sizes
└── public/
    └── film-poster.jpg        # Imagen del poster
```

---

## 🎯 Beneficios de la Implementación

### `next/font`
- ✅ Optimización automática de fuentes
- ✅ Eliminación de Flash of Unstyled Text (FOUT)
- ✅ Self-hosting de fuentes (sin requests a Google)
- ✅ Fuentes específicas por sección con layouts anidados

### `next/image`
- ✅ Optimización automática de imágenes
- ✅ Lazy loading por defecto
- ✅ Prevención de Cumulative Layout Shift (CLS)
- ✅ Carga prioritaria para imágenes above-the-fold
- ✅ Tamaños responsivos con `sizes`

---

## 🚀 Ejecutar el Proyecto

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.
