# UNIR Cinema - CSR (Client-Side Rendering) y SSR (Server-Side Rendering)

Este proyecto demuestra la implementación de **estrategias de renderizado** en Next.js, combinando **Client-Side Rendering (CSR)** y **Server-Side Rendering (SSR)** junto con patrones de **Loading UI (Skeleton)**.

---

## 🖥️ Client-Side Rendering (CSR)

El **Client-Side Rendering** ocurre cuando el código se ejecuta en el navegador del usuario. En Next.js, los componentes que necesitan interactividad, acceso a APIs del navegador, o manejo de estado deben marcarse con la directiva `'use client'`.

### ¿Cuándo usar CSR?

- Componentes con **interactividad** (onClick, onChange, etc.)
- Componentes que usan **hooks de React** (useState, useEffect, useContext)
- Acceso a **APIs del navegador** (localStorage, window, document)
- **Formularios** con validación en tiempo real
- Componentes que necesitan **actualizaciones en tiempo real**

### Componentes CSR en esta aplicación:

| Componente | Ubicación | ¿Por qué es CSR? |
|------------|-----------|------------------|
| `providers.js` | `src/app/providers.js` | Provee contextos globales (AuthContext, GlobalContext) |
| `AuthContext.jsx` | `src/context/AuthContext.jsx` | Manejo de estado de autenticación con useState/useEffect |
| `GlobalContext.jsx` | `src/context/GlobalContext.jsx` | Estado global de la ciudad seleccionada |
| `useLogin.js` | `src/hooks/useLogin.js` | Hook de autenticación con estado |
| `login/page.js` | `src/app/(main)/login/page.js` | Formulario interactivo de login |
| `admin/page.js` | `src/app/(main)/admin/page.js` | Panel que requiere verificación de autenticación |
| `cinema/[city]/page.js` | `src/app/(main)/cinema/[city]/page.js` | Listado con interactividad |
| `CineSelectorServer.jsx` | `src/app/(main)/cartelera/[city]/CineSelectorServer.jsx` | Selector dropdown interactivo |
| `CitySyncClient.jsx` | `src/app/(main)/cartelera/[city]/CitySyncClient.jsx` | Sincroniza URL con contexto global |
| `MovieDetailsClient.jsx` | `src/app/(main)/movie/[id]/MovieDetailsClient.jsx` | Botones interactivos, navegación |
| `SeatSelectionClient.jsx` | `src/app/(main)/movie/[id]/session/[time]/SeatSelectionClient.jsx` | Selección interactiva de asientos |
| `SessionButton.jsx` | `src/components/SessionButton.jsx` | Botón con eventos onClick |
| `Pelicula.jsx` | `src/components/Pelicula.jsx` | Efectos hover, enlaces dinámicos |
| `PrivateRoute.jsx` | `src/components/PrivateRoute.jsx` | Verificación de autenticación en cliente |
| `not-found.js` | `src/app/(main)/not-found.js` | Botón de navegación interactivo |
| `global-error.js` | `src/app/global-error.js` | Botón de retry interactivo |

### Ejemplo de componente CSR:

```jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Lógica de login...
    router.push('/');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      {/* ... */}
    </form>
  );
}
```

---

## 🌐 Server-Side Rendering (SSR)

El **Server-Side Rendering** ocurre cuando el código se ejecuta en el servidor de Next.js. Por defecto, todos los componentes en Next.js App Router son **Server Components**, lo que significa que se renderizan en el servidor.

### ¿Cuándo usar SSR?

- **Fetching de datos** que no requieren interactividad
- Componentes que necesitan acceso a **datos sensibles** (tokens, claves API)
- Reducción del **JavaScript enviado al cliente**
- Componentes de **presentación pura** (solo muestran datos)

### Componentes SSR en esta aplicación:

| Componente | Ubicación | ¿Por qué es SSR? |
|------------|-----------|------------------|
| `layout.js` | `src/app/layout.js` | Layout raíz, estructura HTML |
| `(main)/layout.js` | `src/app/(main)/layout.js` | Layout del grupo principal |
| `page.js` (home) | `src/app/(main)/page.js` | Página inicial con redirect |
| `cartelera/[city]/page.js` | `src/app/(main)/cartelera/[city]/page.js` | Fetch de películas en servidor con cache |
| `MoviesList.jsx` | `src/app/(main)/cartelera/[city]/MoviesList.jsx` | Renderiza lista de películas (sin interactividad) |
| `movie/[id]/page.js` | `src/app/(main)/movie/[id]/page.js` | Detalles de película con fetch en servidor |
| `movie/layout.js` | `src/app/(main)/movie/layout.js` | Layout de la sección de películas |
| `about/page.js` | `src/app/(main)/about/page.js` | Página estática de información |
| `about/layout.js` | `src/app/(main)/about/layout.js` | Layout de la página about |
| `session/[time]/page.js` | `src/app/(main)/movie/[id]/session/[time]/page.js` | Página de sesión con datos del servidor |
| `Header.jsx` | `src/components/Header.jsx` | Navegación principal (puede tener partes CSR) |
| `Footer.jsx` | `src/components/Footer.jsx` | Pie de página estático |
| `PageContainer.jsx` | `src/components/PageContainer.jsx` | Contenedor de layout |
| `MainLayoutWrapper.jsx` | `src/components/MainLayoutWrapper.jsx` | Wrapper del layout principal |
| `loading.js` | `src/app/(main)/cartelera/[city]/loading.js` | Skeleton loading (Server Component) |

### Ejemplo de componente SSR:

```jsx
// Este es un Server Component (no tiene 'use client')
import { getCinemaMoviesWithDetails } from '@/lib/api';
import MoviesList from './MoviesList';

export default async function CarteleraPage({ params }) {
  const { city } = await params;
  
  // Este fetch se ejecuta en el SERVIDOR
  const movies = await getCinemaMoviesWithDetails(city);

  return (
    <div>
      <h1>Cartelera de {city}</h1>
      <MoviesList movies={movies} city={city} />
    </div>
  );
}
```

---

## ⏳ Loading UI Pattern (Skeleton)

Next.js proporciona un patrón especial para mostrar estados de carga usando el archivo `loading.js`. Este archivo se renderiza automáticamente mientras el contenido de la página se está cargando.

### ¿Cómo funciona?

1. Next.js detecta el archivo `loading.js` en la carpeta de la ruta
2. Mientras se resuelven las promesas del `page.js`, muestra el contenido de `loading.js`
3. Una vez cargados los datos, reemplaza el loading por el contenido real

### Implementación del Skeleton:

```jsx
// loading.js - Se muestra mientras page.js carga datos
export default function Loading() {
  return (
    <div className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-10 w-64 bg-cinema-dark-elevated rounded-lg mb-4 animate-pulse" />
      </div>

      {/* Movie cards skeleton */}
      <div className="space-y-8">
        {[1, 2, 3, 4].map((index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
  );
}
```

### Efecto Shimmer

El efecto shimmer da la sensación de que algo se está cargando mediante una animación de "brillo" que recorre el skeleton:

```css
/* globals.css */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
```

```jsx
// Uso en el componente
<div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
```

### Ventajas del patrón Skeleton:

- ✅ **Mejor UX**: El usuario ve la estructura de la página inmediatamente
- ✅ **Percepción de velocidad**: Se siente más rápido que un spinner
- ✅ **No hay layout shift**: El skeleton tiene las mismas dimensiones que el contenido real
- ✅ **Automático**: Next.js lo maneja sin código adicional

---

## 🏗️ Arquitectura del Proyecto

```
┌──────────────────────────────────────────────────────────────┐
│                    SERVIDOR (SSR)                             │
├──────────────────────────────────────────────────────────────┤
│  /cartelera/[city]/page.js                                   │
│    ├── getCinemas()         → force-cache (permanente)       │
│    └── getCinemaMoviesWithDetails(city) → revalidate: 60s    │
│                                                              │
│  /movie/[id]/page.js                                         │
│    ├── getMovieDetails(id)  → revalidate: 3600s (1 hora)     │
│    └── getCinemaMovieSessions(city) → revalidate: 60s        │
│                                                              │
│  loading.js                                                  │
│    └── Skeleton UI mientras se cargan los datos              │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                    CLIENTE (CSR)                              │
├──────────────────────────────────────────────────────────────┤
│  AuthContext.jsx     → Estado de autenticación               │
│  GlobalContext.jsx   → Ciudad seleccionada                   │
│  Header.jsx          → Selector de ciudad + navegación       │
│  CitySyncClient.jsx  → Sincroniza ciudad URL ↔ contexto      │
│  MovieDetailsClient  → Botón volver, enlaces a sesiones      │
│  Pelicula.jsx        → Hover effects, link con ?city=        │
│  login/page.js       → Formulario de login                   │
└──────────────────────────────────────────────────────────────┘
```

---

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── globals.css               # Estilos globales + animación shimmer
│   ├── layout.js                 # 🔵 SSR - Layout raíz
│   ├── providers.js              # 🟢 CSR - Proveedores de contexto
│   ├── global-error.js           # 🟢 CSR - Manejo de errores
│   └── (main)/
│       ├── layout.js             # 🔵 SSR - Layout principal
│       ├── page.js               # 🔵 SSR - Página de inicio
│       ├── not-found.js          # 🟢 CSR - Página 404
│       ├── about/
│       │   ├── layout.js         # 🔵 SSR
│       │   └── page.js           # 🔵 SSR
│       ├── admin/
│       │   └── page.js           # 🟢 CSR - Panel admin
│       ├── login/
│       │   └── page.js           # 🟢 CSR - Formulario login
│       ├── cartelera/[city]/
│       │   ├── page.js           # 🔵 SSR - Cartelera con fetch
│       │   ├── loading.js        # 🔵 SSR - Skeleton loading
│       │   ├── MoviesList.jsx    # 🔵 SSR - Lista de películas
│       │   ├── CineSelectorServer.jsx  # 🟢 CSR - Selector
│       │   └── CitySyncClient.jsx      # 🟢 CSR - Sincronización
│       ├── cinema/[city]/
│       │   └── page.js           # 🟢 CSR
│       └── movie/[id]/
│           ├── layout.js         # 🔵 SSR
│           ├── page.js           # 🔵 SSR - Detalles película
│           ├── MovieDetailsClient.jsx  # 🟢 CSR - Interactividad
│           └── session/[time]/
│               ├── page.js       # 🔵 SSR
│               └── SeatSelectionClient.jsx  # 🟢 CSR
├── components/
│   ├── Footer.jsx                # 🔵 SSR
│   ├── Header.jsx                # 🔵 SSR (con partes CSR)
│   ├── MainLayoutWrapper.jsx     # 🔵 SSR
│   ├── PageContainer.jsx         # 🔵 SSR
│   ├── Pelicula.jsx              # 🟢 CSR
│   ├── PrivateRoute.jsx          # 🟢 CSR
│   └── SessionButton.jsx         # 🟢 CSR
├── context/
│   ├── AuthContext.jsx           # 🟢 CSR
│   └── GlobalContext.jsx         # 🟢 CSR
├── hooks/
│   └── useLogin.js               # 🟢 CSR
└── lib/
    ├── api.js                    # Funciones de fetch (usado en SSR)
    └── actions.js                # Server Actions
```

🔵 = Server Component (SSR)
🟢 = Client Component (CSR)

---

## 🚀 Instalación y Uso

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build de producción
npm run build
npm start
```

---

## 📊 Comparativa CSR vs SSR

| Característica | CSR (Client-Side) | SSR (Server-Side) |
|----------------|-------------------|-------------------|
| **Renderizado** | En el navegador | En el servidor |
| **Tiempo inicial** | Más lento (descarga JS) | Más rápido (HTML completo) |
| **Interactividad** | ✅ Total | ❌ Requiere hidratación |
| **Acceso a APIs navegador** | ✅ Sí | ❌ No |
| **Acceso a datos sensibles** | ❌ No recomendado | ✅ Seguro |
| **Bundle size** | Mayor | Menor |
| **Caché de datos** | En memoria cliente | Data Cache de Next.js |

---

## 🔗 Referencias

- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Next.js Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [Loading UI and Streaming](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [Composition Patterns](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)
