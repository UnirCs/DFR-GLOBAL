# UNIR Cinema - Proxy para Protección de Rutas

Este proyecto forma parte de la serie **UNIR Cinema**. En esta fase, se implementa un **proxy de Next.js** para proteger rutas que requieren autenticación, sustituyendo la protección del lado del cliente (`PrivateRoute`) por una solución del lado del servidor.

> **Nota sobre nomenclatura:** En versiones anteriores a Next.js 16, esta funcionalidad se denominaba "middleware". A partir de Next.js 16, se renombró a **proxy** para reflejar mejor su propósito. En este documento usaremos el término actual: **proxy**.

---

## 🔄 Diferencias con la Fase Anterior

### Resumen de cambios

| Aspecto | Fase 10 (PrivateRoute) | Fase 11 (Proxy) |
|---------|------------------------|-----------------|
| **Protección de rutas** | Componente cliente `PrivateRoute` | Proxy del servidor `proxy.js` |
| **Momento de verificación** | Después de cargar JavaScript | Antes de renderizar la página |
| **Sesión** | Estado en React Context | Cookie `unir-cinema-session` |
| **Redirección** | `useRouter.push()` en cliente | `NextResponse.redirect()` en servidor |
| **JavaScript deshabilitado** | ❌ No protege | ✅ Protege igualmente |

### Archivos nuevos

| Archivo | Descripción |
|---------|-------------|
| `src/proxy.js` | Proxy que intercepta peticiones y verifica autenticación |

### Archivos modificados

| Archivo | Cambios |
|---------|---------|
| `src/context/AuthContext.jsx` | Sincroniza estado con cookie de sesión |
| `src/app/(main)/admin/page.js` | Elimina `PrivateRoute`, ya no es Client Component |
| `src/app/(main)/movie/[id]/session/[time]/page.js` | Elimina `PrivateRoute` |

### Archivos eliminados

| Archivo | Motivo |
|---------|--------|
| `src/components/PrivateRoute.jsx` | Reemplazado por el proxy |

---

## 🛡️ ¿Qué es un Proxy en Next.js?

Un **proxy** es código que se ejecuta en el servidor **antes** de que una petición se complete. Permite interceptar y modificar peticiones entrantes, incluyendo:

- Reescribir URLs
- Redirigir usuarios
- Modificar headers de petición/respuesta
- Verificar autenticación
- Implementar lógica de A/B testing
- Geolocalización y personalización

### Características del Proxy

```javascript
// src/proxy.js
import { NextResponse } from 'next/server';

export function proxy(request) {
  // Se ejecuta ANTES de que la página se renderice
  // Puede redirigir, reescribir o continuar
  return NextResponse.next();
}

export const config = {
  matcher: ['/rutas-a-interceptar/:path*'],
};
```

### Flujo de ejecución

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Cliente    │────▶│    Proxy     │────▶│    Página    │
│  (Browser)   │     │  (Servidor)  │     │   (Server)   │
└──────────────┘     └──────────────┘     └──────────────┘
                            │
                            ▼
                     ¿Autenticado?
                      /         \
                    Sí           No
                    │             │
                    ▼             ▼
              NextResponse   NextResponse
                .next()      .redirect()
```

---

## 📁 Implementación del Proxy (`proxy.js`)

### Código completo

```javascript
import { NextResponse } from 'next/server';

// Rutas que requieren autenticación
const protectedPaths = [
  '/admin',
  '/movie/*/session/*'
];

// Verifica si una ruta coincide con un patrón protegido
function isProtectedPath(pathname) {
  return protectedPaths.some(pattern => {
    const regexPattern = pattern
      .replace(/\*/g, '[^/]+')
      .replace(/\//g, '\\/');
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(pathname);
  });
}

export function proxy(request) {
  const { pathname } = request.nextUrl;

  if (isProtectedPath(pathname)) {
    const sessionCookie = request.cookies.get('unir-cinema-session');

    if (!sessionCookie) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const sessionData = JSON.parse(sessionCookie.value);
      if (!sessionData || !sessionData.username) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
      }
    } catch {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

### Rutas protegidas

| Ruta | Patrón | Descripción |
|------|--------|-------------|
| `/admin` | Exacta | Panel de administración |
| `/movie/*/session/*` | Wildcard | Páginas de selección de asientos |

### Configuración del matcher

El `matcher` define en qué rutas se ejecuta el proxy:

```javascript
matcher: [
  '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
]
```

**Excluye:**
- `_next/static/*` - Archivos estáticos de Next.js
- `_next/image/*` - Imágenes optimizadas
- `favicon.ico` - Favicon
- `*.svg|png|jpg|...` - Archivos de imagen

---

## 🍪 Gestión de Sesión con Cookies

### Flujo de autenticación

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Login     │────▶│  API POST   │────▶│  Guardar    │
│   Form      │     │  /sessions  │     │   Cookie    │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               ▼
                                        unir-cinema-session
                                        {username, name, role}
```

### Cookie de sesión

La cookie `unir-cinema-session` almacena los datos del usuario autenticado:

```json
{
  "username": "admin",
  "name": "Administrador",
  "role": "admin"
}
```

### Sincronización con AuthContext

El `AuthContext` ahora lee la cookie al montar para mantener sincronizado el estado:

```javascript
// src/context/AuthContext.jsx
function getSessionFromCookie() {
  const cookies = document.cookie.split(';');
  const sessionCookie = cookies.find(c => 
    c.trim().startsWith('unir-cinema-session=')
  );
  
  if (!sessionCookie) return null;
  
  const cookieValue = sessionCookie.split('=')[1];
  return JSON.parse(decodeURIComponent(cookieValue));
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const sessionData = getSessionFromCookie();
    if (sessionData) {
      setUser({
        name: sessionData.name,
        role: sessionData.role,
        username: sessionData.username
      });
    }
  }, []);
  
  // ...
};
```

---

## ⚡ Ventajas del Proxy sobre PrivateRoute

### Comparativa

| Aspecto | PrivateRoute (Cliente) | Proxy (Servidor) |
|---------|------------------------|------------------|
| **Ejecución** | Después de hidratar React | Antes de enviar HTML |
| **Tiempo** | +200-500ms (carga JS) | ~0ms |
| **Flash de contenido** | ⚠️ Posible FOUC | ✅ No hay flash |
| **JavaScript deshabilitado** | ❌ No protege | ✅ Funciona igual |
| **Experiencia** | Muestra "Redirigiendo..." | Redirección instantánea |

### Antes (PrivateRoute)

```jsx
// Página admin - Cliente Component
'use client';
import PrivateRoute from '@/components/PrivateRoute';

export default function AdminPage() {
  return (
    <PrivateRoute>
      <div>Contenido admin...</div>
    </PrivateRoute>
  );
}
```

**Problemas:**
1. Carga todo el JavaScript antes de verificar
2. Muestra brevemente "Redirigiendo al login..."
3. El HTML del contenido protegido llega al navegador

### Ahora (Proxy)

```jsx
// Página admin - Server Component (más eficiente)
export default function AdminPage() {
  return <div>Contenido admin...</div>;
}
```

**Ventajas:**
1. Redirección instantánea en el servidor
2. El HTML protegido nunca llega al cliente
3. La página puede ser Server Component (mejor rendimiento)

---

## 🔧 Usos Comunes del Proxy

### 1. Autenticación y Autorización
```javascript
if (!isAuthenticated(request)) {
  return NextResponse.redirect('/login');
}
```

### 2. Redirecciones y Rewrites
```javascript
// Redirigir www a non-www
if (request.nextUrl.hostname.startsWith('www.')) {
  return NextResponse.redirect(new URL(request.url.replace('www.', '')));
}

// Rewrite interno (URL visible no cambia)
return NextResponse.rewrite(new URL('/api/proxy', request.url));
```

### 3. Internacionalización (i18n)
```javascript
const locale = request.headers.get('accept-language')?.split(',')[0] || 'en';
return NextResponse.rewrite(new URL(`/${locale}${pathname}`, request.url));
```

### 4. A/B Testing
```javascript
const bucket = request.cookies.get('ab-bucket') || Math.random() > 0.5 ? 'a' : 'b';
return NextResponse.rewrite(new URL(`/experiments/${bucket}${pathname}`, request.url));
```

### 5. Rate Limiting
```javascript
const ip = request.ip;
if (await isRateLimited(ip)) {
  return new NextResponse('Too Many Requests', { status: 429 });
}
```

### 6. Headers de Seguridad
```javascript
const response = NextResponse.next();
response.headers.set('X-Frame-Options', 'DENY');
response.headers.set('X-Content-Type-Options', 'nosniff');
return response;
```

---

## 📍 Uso en el Proyecto

### Rutas protegidas actuales

| Ruta | Requiere | Comportamiento |
|------|----------|----------------|
| `/admin` | Sesión válida | Redirige a `/login?from=/admin` |
| `/movie/1/session/17:30` | Sesión válida | Redirige a `/login?from=...` |

### Flujo completo

1. Usuario intenta acceder a `/admin`
2. Proxy intercepta la petición
3. Busca cookie `unir-cinema-session`
4. Si no existe → Redirige a `/login?from=/admin`
5. Si existe → Valida JSON y campos requeridos
6. Si válida → `NextResponse.next()` (continúa)
7. Página `/admin` se renderiza

### Parámetro `from`

El parámetro `from` preserva la ruta original para redirigir después del login:

```javascript
// proxy.js
loginUrl.searchParams.set('from', pathname);

// login/page.js
const from = searchParams.get('from') || '/';
router.push(from);
```

---

## 🚀 Instalación y Uso

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build
npm run build

# Producción
npm start
```

### Probar la protección

1. Sin sesión, accede a `/admin` → Redirige a `/login?from=/admin`
2. Haz login con `admin` / `admin123`
3. Automáticamente redirige a `/admin`
4. La cookie `unir-cinema-session` está activa

---

## ⚠️ Consideraciones

### Ubicación del archivo

Next.js busca el proxy en:
- `proxy.js` o `proxy.ts` en la raíz del proyecto
- O en `src/proxy.js` si usas la carpeta `src`

> **Nota sobre versiones anteriores:** En versiones previas a Next.js 16, el archivo se llamaba `middleware.js`. Si trabajas con versiones antiguas, puede que necesites usar ese nombre.

### Limitaciones del Edge Runtime

El proxy se ejecuta en Edge Runtime por defecto:

| ✅ Permitido | ❌ No permitido |
|--------------|-----------------|
| `fetch()` | `fs` (filesystem) |
| `Request/Response` | Conexiones TCP directas |
| Cookies | Node.js APIs nativas |
| Headers | Pools de base de datos |
| `crypto.subtle` | `pg`, `mysql2`, etc. |

### Tiempo de ejecución

El proxy debe ser rápido (<50ms idealmente). Para lógica pesada, usa Route Handlers.

---

## 🔗 Referencias

- [Next.js Proxy (anteriormente Middleware)](https://nextjs.org/docs/app/building-your-application/routing/middleware) - Documentación oficial
- [NextResponse API](https://nextjs.org/docs/app/api-reference/functions/next-response) - Métodos disponibles
- [Proxy Examples](https://github.com/vercel/examples/tree/main/edge-middleware) - Ejemplos de Vercel
- [Edge Runtime](https://nextjs.org/docs/app/api-reference/edge) - Limitaciones y capacidades
- [Authentication Patterns](https://nextjs.org/docs/app/building-your-application/authentication) - Patrones de autenticación en Next.js

