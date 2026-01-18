# UNIR Cinema - Tema Oscuro con TailwindCSS

Este proyecto demuestra la implementación de un **tema oscuro de cine** utilizando **TailwindCSS v4** con clases utilitarias directamente en los componentes de una aplicación Next.js. El diseño está inspirado en la estética cinematográfica con colores rojos, dorados y negros.

## 🎬 Características del Diseño

### Paleta de Colores de Cine

- **Rojo Cine**: `#dc143c` - Color principal para botones de acción y acentos
- **Dorado**: `#d4af37` - Color secundario para títulos y elementos destacados
- **Negro Cine**: `#121212` - Fondo principal oscuro
- **Gris Elevado**: `#2a2a2a` - Tarjetas y elementos elevados

### Elementos Visuales

- Header con gradiente oscuro y borde rojo
- Logo con texto dorado brillante (gradiente)
- Botones con efectos de brillo y sombras de color
- Tarjetas con bordes sutiles y efectos hover
- Asientos de cine con colores distintivos (verde/dorado/rojo)

## 📦 Instalación de TailwindCSS v4

### Dependencias instaladas:

```bash
npm install tailwindcss @tailwindcss/postcss
```

### Configuración PostCSS (`postcss.config.mjs`):

```javascript
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

### Importación en globals.css:

```css
@import "tailwindcss";
```

## 🎨 Configuración del Tema con @theme

En TailwindCSS v4, los colores personalizados se definen usando la directiva `@theme` en `globals.css`:

```css
@theme {
  /* Colores de cine */
  --color-cinema-red: #dc143c;
  --color-cinema-red-dark: #8b0000;
  --color-cinema-red-light: #ff4d6d;
  --color-cinema-gold: #d4af37;
  --color-cinema-gold-dark: #b8860b;
  --color-cinema-gold-light: #f4d03f;
  
  /* Fondos oscuros */
  --color-cinema-dark: #121212;
  --color-cinema-dark-secondary: #1a1a1a;
  --color-cinema-dark-card: #1e1e1e;
  --color-cinema-dark-elevated: #2a2a2a;
  
  /* Textos */
  --color-cinema-text: #f5f5f5;
  --color-cinema-text-muted: #b0b0b0;
  
  /* Bordes */
  --color-cinema-border: #333333;
}
```

Esto permite usar clases como `bg-cinema-dark`, `text-cinema-gold`, `border-cinema-red`, etc.

## 📁 Estructura de Estilos

### Enfoque: Tailwind-First

La mayoría de los estilos se aplican directamente con clases de Tailwind en los componentes JSX:

```jsx
// Ejemplo de Header.jsx
<header className="bg-gradient-to-r from-cinema-dark-secondary via-cinema-dark-elevated to-cinema-dark-secondary border-b-2 border-cinema-red px-6 py-4 sticky top-0 z-50">
  ...
</header>
```

### CSS Modules (uso mínimo)

Solo se usan CSS Modules para efectos que Tailwind no puede manejar fácilmente, como animaciones con pseudo-elementos:

| Archivo | Propósito |
|---------|-----------|
| `Pelicula.module.css` | Efecto shine en botones de sesión |
| `MovieDetails.module.css` | Efecto shine en botones de horario |

```css
/* Efecto shine - requiere ::before */
.sessionLink {
  position: relative;
  overflow: hidden;
}

.sessionLink::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.sessionLink:hover::before {
  left: 100%;
}
```

### Archivo Global (`src/app/globals.css`)

Contiene solo:
- Importación de TailwindCSS
- Definición del tema con `@theme`
- Reset CSS básico
- Estilos de scrollbar personalizado
- Estilos de selección de texto

## 🧩 Ejemplos de Uso de Tailwind

### Botón Dorado (CTA Principal)
```jsx
<button className="bg-gradient-to-r from-cinema-gold to-cinema-gold-dark text-cinema-dark px-5 py-2 rounded-lg font-bold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cinema-gold/50 hover:brightness-110 transition-all duration-300">
  Iniciar Sesión
</button>
```

### Botón Rojo (Acción/Sesiones)
```jsx
<Link className="px-4 py-2 bg-gradient-to-r from-cinema-red to-cinema-red-dark text-white rounded-full font-semibold shadow-lg shadow-cinema-red/30 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300">
  18:00
</Link>
```

### Tarjeta de Película
```jsx
<div className="bg-gradient-to-br from-cinema-dark-card to-cinema-dark-elevated p-5 rounded-2xl shadow-lg shadow-black/50 border border-cinema-border hover:-translate-y-1 hover:border-cinema-red transition-all duration-300">
  ...
</div>
```

### Input de Formulario
```jsx
<input className="w-full p-3 rounded-lg border-2 border-cinema-border bg-cinema-dark-elevated text-cinema-text focus:border-cinema-gold focus:outline-none focus:ring-2 focus:ring-cinema-gold/20 transition-all" />
```

## ✨ Beneficios de esta Arquitectura

1. **Tailwind-First**: Estilos directamente en JSX, sin archivos CSS separados innecesarios.

2. **Tema oscuro permanente**: No hay toggle dark/light, diseño oscuro consistente de cine.

3. **Colores personalizados**: Definidos con `@theme` y accesibles como clases de Tailwind.

4. **CSS Modules mínimos**: Solo para efectos avanzados (pseudo-elementos con animaciones).

5. **Rendimiento**: TailwindCSS v4 optimiza y purga automáticamente los estilos no usados.

6. **Mantenibilidad**: Los estilos son visibles directamente en el componente.

## 📝 Cambios Realizados

- ✅ Instalación de `tailwindcss` y `@tailwindcss/postcss`
- ✅ Creación de `postcss.config.mjs`
- ✅ Configuración de tema personalizado con `@theme` en `globals.css`
- ✅ Migración de todos los componentes a clases de Tailwind
- ✅ Eliminación de CSS Modules innecesarios (solo quedan 2 archivos)
- ✅ Eliminación del sistema de toggle dark/light mode
- ✅ Simplificación de `GlobalContext` (solo maneja ciudad)
- ✅ Rediseño completo con colores de cine (rojo, dorado, negro)

## 🗂️ Archivos CSS Eliminados

Los siguientes archivos CSS Module fueron eliminados al migrar a Tailwind:

- `Header.module.css`
- `Footer.module.css`
- `CineSelector.module.css`
- `SeatSelection.module.css`
- `PageContainer.module.css`
- `MainLayoutWrapper.module.css`
- `PrivateRoute.module.css`
- `HomePage.module.css`
- `AboutPage.module.css`
- `LoginPage.module.css`
- `AdminPage.module.css`
- `NotFound.module.css`
