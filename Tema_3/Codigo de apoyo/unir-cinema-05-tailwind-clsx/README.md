# UNIR Cinema - Tema Oscuro con TailwindCSS + CLSX

Este proyecto demuestra la implementación de un **tema oscuro de cine** utilizando **TailwindCSS v4** junto con **clsx** para una gestión más limpia y organizada de las clases utilitarias en los componentes de una aplicación Next.js. El diseño está inspirado en la estética cinematográfica con colores rojos, dorados y negros.

## 📚 ¿Qué es CLSX?

**clsx** es una pequeña utilidad (~234 bytes minificados) para construir strings de clases de forma condicional. Es especialmente útil cuando trabajamos con frameworks de CSS utilitario como TailwindCSS.

### ¿Para qué sirve?

- **Concatenar clases**: Combina múltiples strings de clases de forma limpia
- **Clases condicionales**: Aplica clases basadas en condiciones booleanas
- **Mejor legibilidad**: Organiza clases largas en múltiples líneas
- **Combinar fuentes de clases**: Mezcla clases de Tailwind con CSS Modules
- **Evitar strings vacíos**: Maneja automáticamente valores falsy

### Instalación

```bash
npm install clsx
```

### Uso básico

```jsx
import clsx from 'clsx';

// 1. Concatenar strings
clsx('foo', 'bar');  // => 'foo bar'

// 2. Condicionales con objetos
clsx({ 'bg-red-500': isError, 'bg-green-500': isSuccess });

// 3. Arrays para organizar clases
clsx([
  'base-class',
  'text-white',
  condition && 'optional-class'
]);

// 4. Combinación de múltiples argumentos
clsx(
  'px-4 py-2 rounded-lg',     // Clases base
  'bg-blue-500 text-white',    // Colores
  'hover:bg-blue-600',         // Estados
  isActive && 'ring-2',        // Condicionales
  className                     // Props externos
);
```

### Ejemplos prácticos en el proyecto

#### Clases condicionales para estados de asientos:
```jsx
const getSeatClasses = (seat) => {
  const isSelected = selectedSeats.includes(seat.id);
  
  return clsx(
    // Clases base
    'aspect-square rounded-lg flex items-center justify-center font-bold text-xs transition-all duration-300 border-2',
    {
      // Estado: Ocupado
      'bg-cinema-red/70 text-white border-cinema-red-dark cursor-not-allowed': seat.isOccupied,
      // Estado: Seleccionado
      'bg-cinema-gold text-cinema-dark border-cinema-gold shadow-lg shadow-cinema-gold/50 cursor-pointer': !seat.isOccupied && isSelected,
      // Estado: Disponible
      'bg-green-600 text-white border-green-600 cursor-pointer hover:scale-110 hover:shadow-lg hover:shadow-green-500/50': !seat.isOccupied && !isSelected,
    }
  );
};
```

#### Organizar clases largas de Tailwind:
```jsx
// Sin clsx - difícil de leer
<header className="bg-gradient-to-r from-cinema-dark-secondary via-cinema-dark-elevated to-cinema-dark-secondary border-b-2 border-cinema-red px-6 py-4 sticky top-0 z-50 shadow-lg shadow-black/50">

// Con clsx - más organizado y legible
<header className={clsx(
  'bg-gradient-to-r from-cinema-dark-secondary via-cinema-dark-elevated to-cinema-dark-secondary',
  'border-b-2 border-cinema-red px-6 py-4',
  'sticky top-0 z-50',
  'shadow-lg shadow-black/50'
)}>
```

#### Combinar CSS Modules con Tailwind:
```jsx
<Link
  href={`/movie/${movie.id}/session/${time}`}
  className={clsx(
    styles.sessionLink,  // CSS Module para efecto shine
    'px-4 py-2 bg-gradient-to-r from-cinema-red to-cinema-red-dark',
    'text-white rounded-full font-semibold text-sm',
    'shadow-lg shadow-cinema-red/30',
    'hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cinema-red/50 hover:brightness-110',
    'transition-all duration-300'
  )}
>
  {time}
</Link>
```

#### Crear clases reutilizables:
```jsx
// Definir clases reutilizables
const navLinkClasses = clsx(
  'text-cinema-text px-4 py-2 rounded-lg bg-white/5',
  'border border-transparent',
  'hover:border-cinema-gold hover:text-cinema-gold hover:-translate-y-0.5',
  'transition-all duration-300 font-medium'
);

// Usar en múltiples elementos
<Link href="/" className={navLinkClasses}>Inicio</Link>
<Link href="/about" className={navLinkClasses}>Nosotros</Link>
```

## 🎯 Patrón de Variantes con CLSX

Una de las técnicas más poderosas con clsx es crear componentes con **variantes predefinidas**. Esto permite cambiar la apariencia de un componente basándose en props, similar a cómo funcionan librerías como `cva` (class-variance-authority).

### Ejemplo: SessionButton con variantes de formato

El componente `SessionButton` demuestra este patrón. Cada película tiene un formato (3D, IMAX, HDFR, Standard) y el botón de sesión cambia de color según el formato:

```jsx
// components/SessionButton.jsx
import Link from 'next/link';
import clsx from 'clsx';
import styles from './Pelicula.module.css';

// Clases base del botón
const base = clsx(
  'px-4 py-2 rounded-full font-semibold text-sm',
  'shadow-lg transition-all duration-300',
  'hover:-translate-y-0.5 hover:brightness-110'
);

// Variantes de color según el formato de película
const variants = {
  standard: clsx(
    'bg-gradient-to-r from-cinema-red to-cinema-red-dark',
    'text-white',
    'shadow-cinema-red/30',
    'hover:shadow-xl hover:shadow-cinema-red/50'
  ),
  '3d': clsx(
    'bg-gradient-to-r from-emerald-500 to-emerald-700',
    'text-white',
    'shadow-emerald-500/30',
    'hover:shadow-xl hover:shadow-emerald-500/50'
  ),
  hdfr: clsx(
    'bg-gradient-to-r from-violet-500 to-violet-700',
    'text-white',
    'shadow-violet-500/30',
    'hover:shadow-xl hover:shadow-violet-500/50'
  ),
  imax: clsx(
    'bg-gradient-to-r from-cyan-500 to-cyan-700',
    'text-white',
    'shadow-cyan-500/30',
    'hover:shadow-xl hover:shadow-cyan-500/50'
  ),
};

// Etiquetas de formato
const formatLabels = {
  standard: null,
  '3d': '3D',
  hdfr: 'HDFR',
  imax: 'IMAX',
};

const SessionButton = ({ 
  movieId, 
  time, 
  format = 'standard',
  className 
}) => {
  const normalizedFormat = format?.toLowerCase() || 'standard';
  const variant = variants[normalizedFormat] || variants.standard;
  const label = formatLabels[normalizedFormat];

  return (
    <Link
      href={`/movie/${movieId}/session/${time}`}
      className={clsx(
        styles.sessionLink,  // CSS Module para efecto shine
        base,                 // Clases base
        variant,              // Variante por formato
        className             // Clases adicionales
      )}
    >
      {time}
      {label && <span className="ml-1.5 text-xs opacity-90 font-bold">{label}</span>}
    </Link>
  );
};

export default SessionButton;
```

### Uso en el componente Pelicula

```jsx
// En Pelicula.jsx
import SessionButton from './SessionButton';

// Cada película tiene un atributo 'format' en sus datos
{movie.showtimes?.map((time, index) => (
  <SessionButton
    key={index}
    movieId={movie.id}
    time={time}
    format={movie.format}  // 'standard' | '3d' | 'hdfr' | 'imax'
  />
))}
```

### Estructura de datos con formato

Las películas ahora incluyen un atributo `format`:

```javascript
// data/moviesDataBarcelona.js
export const moviesDataBarcelona = [
  {
    id: 1,
    title: "Avatar: El camino del agua",
    format: "3d",  // Nuevo atributo
    // ...resto de datos
  },
  {
    id: 2,
    title: "Black Panther: Wakanda Forever",
    format: "imax",
    // ...
  },
  {
    id: 3,
    title: "Top Gun: Maverick",
    format: "hdfr",
    // ...
  }
];
```

### Colores por formato

| Formato | Color | Descripción |
|---------|-------|-------------|
| `standard` | Rojo Cinema | Formato estándar de proyección |
| `3d` | Esmeralda | Proyección en 3D |
| `hdfr` | Violeta | High Dynamic Frame Rate (alta velocidad de cuadros) |
| `imax` | Cian | Formato IMAX premium |

### Beneficios del patrón de variantes

1. **Centralizado**: Todas las variantes definidas en un solo lugar
2. **Type-safe**: Fácil de tipar con TypeScript
3. **Extensible**: Agregar nuevas variantes es trivial
4. **Consistente**: Garantiza uniformidad en toda la app
5. **Mantenible**: Cambiar un estilo afecta todos los usos

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

## 📦 Instalación

### Dependencias instaladas:

```bash
npm install tailwindcss @tailwindcss/postcss clsx
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

### Enfoque: Tailwind-First con CLSX

La mayoría de los estilos se aplican directamente con clases de Tailwind en los componentes JSX, organizadas con clsx para mejor legibilidad:

```jsx
// Ejemplo de Header.jsx
<header className={clsx(
  'bg-gradient-to-r from-cinema-dark-secondary via-cinema-dark-elevated to-cinema-dark-secondary',
  'border-b-2 border-cinema-red px-6 py-4',
  'sticky top-0 z-50',
  'shadow-lg shadow-black/50'
)}>
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

## 🧩 Componentes Actualizados con CLSX

Los siguientes componentes utilizan clsx para organizar sus clases de Tailwind:

| Componente | Uso de clsx |
|------------|-------------|
| `Header.jsx` | Clases reutilizables para enlaces de navegación |
| `Footer.jsx` | Organización de clases del footer |
| `Pelicula.jsx` | Badges de formato y organización de clases |
| `SessionButton.jsx` | **Patrón de variantes** según formato (3D, IMAX, HDFR, Standard) |
| `CineSelector.jsx` | Organización de clases del selector |
| `SeatSelection.jsx` | **Clases condicionales** para estados de asientos |
| `PageContainer.jsx` | Combinación de clases base + className prop |
| `PrivateRoute.jsx` | Clases del estado de carga |
| `LoginPage` | Clases reutilizables para inputs |
| `AboutPage` | Clases reutilizables para secciones y tarjetas |
| `AdminPage` | Clases reutilizables para tarjetas de stats |
| `MovieDetailsPage` | Clases reutilizables para botones y tarjetas |
| `NotFound` | Organización de clases del error 404 |

## ✨ Beneficios de esta Arquitectura

1. **Tailwind-First**: Estilos directamente en JSX, sin archivos CSS separados innecesarios.

2. **CLSX para Organización**: Clases largas de Tailwind organizadas en múltiples líneas para mejor legibilidad.

3. **Clases Condicionales Limpias**: Estados de componentes manejados con objetos en clsx.

4. **Reutilización**: Variables locales para patrones de clases repetidos.

5. **Combinación Seamless**: CSS Modules para efectos especiales integrados con Tailwind via clsx.

6. **Tema oscuro permanente**: No hay toggle dark/light, diseño oscuro consistente de cine.

7. **Colores personalizados**: Definidos con `@theme` y accesibles como clases de Tailwind.

8. **Rendimiento**: TailwindCSS v4 optimiza y purga automáticamente los estilos no usados.

9. **Mantenibilidad**: Los estilos son visibles directamente en el componente, organizados de forma clara.

## 📝 Cambios Realizados

- ✅ Instalación de `tailwindcss` y `@tailwindcss/postcss`
- ✅ Instalación de `clsx` para gestión de clases
- ✅ Creación de `postcss.config.mjs`
- ✅ Configuración de tema personalizado con `@theme` en `globals.css`
- ✅ Migración de todos los componentes a clases de Tailwind
- ✅ Integración de clsx en todos los componentes principales
- ✅ **Creación del componente `SessionButton` con variantes de formato**
- ✅ **Añadido atributo `format` a los datos de películas** (3D, IMAX, HDFR, Standard)
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

## 🔗 Recursos

- [Documentación de CLSX](https://github.com/lukeed/clsx)
- [TailwindCSS v4](https://tailwindcss.com)
- [Next.js App Router](https://nextjs.org/docs/app)

