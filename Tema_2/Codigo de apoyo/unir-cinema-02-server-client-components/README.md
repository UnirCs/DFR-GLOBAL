# UNIR Cinema - Server y Client Components

Este proyecto demuestra el uso de **Server Components** y **Client Components** en Next.js App Router.

## 🎯 Resumen de Cambios Realizados

Se ha refactorizado el proyecto para aprovechar la arquitectura de componentes de Next.js 13+, separando claramente entre Server Components y Client Components según las necesidades de cada uno.

### Cambios Principales:

1. **Layout principal (`(main)/layout.js`)**: Convertido a Server Component que importa componentes Client y Server según necesidad.

2. **Footer.jsx**: Convertido a **Server Component** - solo muestra contenido estático sin interactividad.

3. **About page**: Convertida a **Server Component** con su propio layout que usa PageContainer (client) para el tema.

4. **Nuevos componentes creados**:
   - `MainLayoutWrapper.jsx` - Client wrapper para manejar el modo oscuro del layout
   - `PageContainer.jsx` - Client wrapper reutilizable para páginas con soporte de tema

---

## 📋 Clasificación de Componentes

### ✅ Server Components

| Componente/Archivo | Ubicación | Razón |
|-------------------|-----------|-------|
| `layout.js` | `app/layout.js` | Layout raíz, solo estructura HTML |
| `layout.js` | `app/(main)/layout.js` | Composición de componentes server/client |
| `layout.js` | `app/(main)/about/layout.js` | Wrapper para la sección about |
| `page.js` | `app/(main)/about/page.js` | Contenido estático informativo |
| `Footer.jsx` | `components/Footer.jsx` | Solo renderiza texto estático |

### 🔵 Client Components

| Componente/Archivo | Ubicación | Razón |
|-------------------|-----------|-------|
| `providers.js` | `app/providers.js` | Los Context Providers requieren useState |
| `AuthContext.jsx` | `context/AuthContext.jsx` | Contexto con estado (useState) |
| `GlobalContext.jsx` | `context/GlobalContext.jsx` | Contexto con estado (city, darkMode) |
| `Header.jsx` | `components/Header.jsx` | useContext, onClick, toggle darkMode |
| `CineSelector.jsx` | `components/CineSelector.jsx` | useContext, onChange para cambiar ciudad |
| `Pelicula.jsx` | `components/Pelicula.jsx` | useContext para darkMode |
| `SeatSelection.jsx` | `components/SeatSelection.jsx` | useState, onClick, useRouter |
| `PrivateRoute.jsx` | `components/PrivateRoute.jsx` | useContext, useEffect, useRouter |
| `MainLayoutWrapper.jsx` | `components/MainLayoutWrapper.jsx` | useContext para darkMode |
| `PageContainer.jsx` | `components/PageContainer.jsx` | useContext para darkMode |
| `page.js` | `app/(main)/page.js` | useContext para obtener películas |
| `page.js` | `app/(main)/login/page.js` | useState, useContext, useRouter |
| `page.js` | `app/(main)/admin/page.js` | useContext, PrivateRoute |
| `page.js` | `app/(main)/movie/[id]/page.js` | useRouter, useSearchParams, useContext |
| `page.js` | `app/(main)/movie/[id]/session/[time]/page.js` | PrivateRoute, SeatSelection |
| `page.js` | `app/(main)/cinema/[city]/page.js` | useRouter, useContext, PrivateRoute |
| `useMovies.js` | `hooks/useMovies.js` | Hook que usa useContext |
| `useLogin.js` | `hooks/useLogin.js` | Hook que usa useState |

---

## 🤔 ¿Por qué esta clasificación?

### Server Components cuando:
- El contenido es **estático** (no cambia con interacción del usuario)
- No necesita **acceso a estado** (useState, useReducer)
- No necesita **efectos** (useEffect)
- No necesita **event handlers** (onClick, onChange)
- No necesita **APIs del navegador** (localStorage, window)
- No necesita **acceso a contextos de React** (useContext)

### Client Components cuando:
- Necesita **interactividad** (clicks, formularios, etc.)
- Usa **hooks de React** (useState, useEffect, useContext, etc.)
- Usa **APIs del navegador**
- Es un **Context Provider** o consume un contexto
- Usa **hooks personalizados** que internamente usan hooks de React

---

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── layout.js              # Server - Root layout
│   ├── providers.js           # Client - Context providers
│   ├── globals.css            # Estilos globales
│   │
│   └── (main)/                # Route Group principal
│       ├── layout.js          # Server - Composición
│       ├── page.js            # Client - Home con películas
│       │
│       ├── about/
│       │   ├── layout.js      # Server - Wrapper about
│       │   └── page.js        # Server - Contenido estático
│       │
│       ├── login/
│       │   └── page.js        # Client - Formulario login
│       │
│       ├── admin/
│       │   └── page.js        # Client - Panel protegido
│       │
│       ├── movie/
│       │   └── [id]/
│       │       ├── page.js    # Client - Detalles película
│       │       └── session/
│       │           └── [time]/
│       │               └── page.js  # Client - Selección asientos
│       │
│       └── cinema/
│           └── [city]/
│               └── page.js    # Client - Info cine protegida
│
├── components/
│   ├── Footer.jsx             # Server - Texto estático
│   ├── Header.jsx             # Client - Navegación interactiva
│   ├── CineSelector.jsx       # Client - Selector de ciudad
│   ├── Pelicula.jsx           # Client - Card de película
│   ├── SeatSelection.jsx      # Client - Selector de asientos
│   ├── PrivateRoute.jsx       # Client - Protección de rutas
│   ├── MainLayoutWrapper.jsx  # Client - Wrapper tema layout
│   └── PageContainer.jsx      # Client - Wrapper tema páginas
│
├── context/
│   ├── AuthContext.jsx        # Client - Estado autenticación
│   └── GlobalContext.jsx      # Client - Estado global (ciudad, tema)
│
├── hooks/
│   ├── useMovies.js           # Client - Hook películas
│   └── useLogin.js            # Client - Hook login
│
└── data/                      # Datos estáticos (pueden usarse en server o client)
    ├── moviesDataMadrid.js
    ├── moviesDataBarcelona.js
    ├── moviesDataValencia.js
    ├── moviesDataSevilla.js
    └── usersData.js
```

---

## 🚀 Cómo ejecutar

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 👤 Usuarios de prueba

- **Admin**: usuario = `admin`, contraseña = `admin`
- **Usuario**: usuario = `user`, contraseña = `user`

