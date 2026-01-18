# UNIR Cinema - App Router

Este proyecto es una adaptación de la aplicación UNIR Cinema de React standalone a Next.js utilizando el **App Router**.

## 🎯 Objetivo Educativo

Este proyecto está diseñado para enseñar los conceptos fundamentales del **App Router** de Next.js:

- **Route Groups**: Organización de rutas con `(main)`
- **Layouts**: Layout compartido para Header/Footer
- **Dynamic Routes**: Rutas dinámicas como `[id]` y `[city]`
- **Not Found Pages**: Manejo de rutas no encontradas
- **Global Error**: Manejo de errores globales

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── layout.js              # Root layout (incluye providers)
│   ├── providers.js           # Client component con contextos
│   ├── globals.css            # Estilos globales
│   ├── not-found.js           # Not found global
│   ├── global-error.js        # Error handler global
│   │
│   └── (main)/                # Route Group principal
│       ├── layout.js          # Layout con Header/Footer
│       ├── not-found.js       # Not found del grupo
│       ├── page.js            # Página principal (/)
│       │
│       ├── about/
│       │   └── page.js        # Página sobre nosotros (/about)
│       │
│       ├── login/
│       │   └── page.js        # Página de login (/login)
│       │
│       ├── admin/
│       │   └── page.js        # Panel admin (/admin) - Protegida
│       │
│       ├── movie/
│       │   └── [id]/
│       │       ├── page.js    # Detalles película (/movie/1)
│       │       └── session/
│       │           └── [time]/
│       │               └── page.js  # Selección asientos - Protegida
│       │
│       └── cinema/
│           └── [city]/
│               └── page.js    # Info del cine (/cinema/madrid) - Protegida
│
├── components/                # Componentes reutilizables
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── CineSelector.jsx
│   ├── Pelicula.jsx
│   ├── PrivateRoute.jsx
│   └── SeatSelection.jsx
│
├── context/                   # Contextos de React
│   ├── AuthContext.jsx        # Autenticación
│   └── GlobalContext.jsx      # Ciudad y modo oscuro
│
├── data/                      # Datos simulados
│   ├── moviesDataMadrid.js
│   ├── moviesDataBarcelona.js
│   ├── moviesDataValencia.js
│   ├── moviesDataSevilla.js
│   └── usersData.js
│
└── hooks/                     # Custom hooks
    ├── useMovies.js           # Hook de películas y contexto
    └── useLogin.js            # Hook de autenticación
```

## 🔑 Conceptos Clave

### Route Groups `(main)`

Los Route Groups permiten organizar rutas sin afectar la URL. El grupo `(main)` contiene todas las páginas que comparten el mismo layout (Header + Footer).

```
/           -> app/(main)/page.js
/about      -> app/(main)/about/page.js
/login      -> app/(main)/login/page.js
```

### Dynamic Routes

Las rutas dinámicas usan corchetes para capturar parámetros:

- `/movie/[id]` → captura el ID de la película
- `/cinema/[city]` → captura el nombre de la ciudad
- `/movie/[id]/session/[time]` → captura múltiples parámetros

### Not Found Pages

Existen dos niveles de páginas not-found:

- `app/not-found.js`: Error 404 **global** (sin Header/Footer)
- `app/(main)/not-found.js`: Error 404 **dentro del grupo** (con Header/Footer)

#### ¿Cómo probar cada Not Found?

**1. Not Found Global** - Accede a cualquier ruta que no exista:
```
http://localhost:3000/ruta-inexistente
http://localhost:3000/xyz123
http://localhost:3000/cualquier-cosa
```

**2. Not Found del Route Group** - Se activa con `notFound()` desde páginas del grupo:
```
http://localhost:3000/movie/99999     # ID de película que no existe
http://localhost:3000/cinema/paris    # Ciudad que no existe
```

> **Nota:** El not-found del route group solo se muestra cuando se llama a `notFound()` explícitamente desde el código, no por rutas inexistentes.

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar producción
npm start
```

## 👤 Usuarios de Prueba

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin   | admin      | Admin |
| user    | user       | Usuario |

## 📝 Notas Importantes

1. **Client Components**: Todos los componentes usan `'use client'` ya que en este punto solo se enseña App Router
2. **Sin Server Components**: No hay `loading.js` ni data fetching del servidor
3. **CSS Global**: Se usa un único archivo `globals.css` basado en el `App.css` original
4. **Import Alias**: Se usa `@/` para imports absolutos
5. **Suspense Boundaries**: Se usan en páginas con `useSearchParams` para evitar errores de prerenderizado

## 🎓 Para Estudiantes

Este proyecto te ayudará a entender:

1. Cómo migrar de React Router a App Router
2. Cómo funcionan los route groups
3. El sistema de rutas basado en carpetas
4. El manejo de errores y páginas not found
5. La diferencia entre not-found global y de grupo

---

Desarrollado para fines educativos - UNIR
