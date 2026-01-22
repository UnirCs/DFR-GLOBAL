# UNIR Cinema - Autenticación con Auth0 y OAuth 2.0

Este proyecto forma parte de la serie **UNIR Cinema**. En esta fase, se implementa **autenticación real** mediante **Auth0** con federación OAuth 2.0, utilizando **Google** como proveedor de identidad. Esto sustituye la autenticación local basada en usuario/contraseña por un sistema de autenticación delegada profesional.

---

## 🔄 Diferencias con la Fase Anterior

### Resumen de cambios

| Aspecto | Fase 11 (Cookie manual) | Fase 12 (Auth0) |
|---------|-------------------------|-----------------|
| **Proveedor de autenticación** | Local (usuario/contraseña en BD) | Auth0 + Google OAuth 2.0 |
| **Cookie de sesión** | `unir-cinema-session` (JSON manual) | `__session` (token encriptado Auth0) |
| **Login** | Formulario en `/login` | Redirige a `/auth/login` → Google |
| **Logout** | `DELETE /api/v1/sessions` + limpiar cookie | `/auth/logout` (Auth0) |
| **Verificación en proxy** | Parsear cookie JSON manualmente | `auth0.getSession(request)` |
| **Gestión de sesión** | Manual con `document.cookie` | Automática por Auth0 SDK |
| **Sincronización BD** | No existía | Una sola vez en `/auth-callback` via `/api/v1/sync` |

### Archivos nuevos

| Archivo | Descripción |
|---------|-------------|
| `src/lib/auth0.js` | Cliente Auth0 para Server Components |
| `src/app/api/v1/sync/route.js` | Endpoint para sincronizar usuario con BD |
| `src/app/(main)/auth-callback/page.js` | Página intermedia post-login que llama a `/api/v1/sync` |

### Archivos modificados

| Archivo | Cambios principales |
|---------|---------------------|
| `src/proxy.js` | Integra `auth0.middleware()`, intercepta callback para redirigir a `/auth-callback` |
| `src/app/providers.js` | Añade `Auth0Provider` como wrapper |
| `src/context/AuthContext.jsx` | Usa `useUser` de Auth0 en lugar de leer cookie manual |
| `src/components/Header.jsx` | Links a `/auth/login` y `/auth/logout`, muestra avatar de Google |
| `src/app/(main)/profile/page.js` | Ya no sincroniza, solo muestra datos del usuario |
| `src/lib/api.js` | Eliminada función `loginUser()` |

### Archivos eliminados

| Archivo | Motivo |
|---------|--------|
| `src/app/(main)/login/page.js` | Auth0 proporciona `/auth/login` automáticamente |
| `src/hooks/useLogin.js` | Ya no hay login local con usuario/contraseña |
| `src/app/api/v1/sessions/route.js` | Auth0 maneja sesiones, sincronización movida a `/api/v1/sync` |

---

## 🔐 ¿Qué es Auth0?

**Auth0** es una plataforma de Identity-as-a-Service (IDaaS) que proporciona autenticación y autorización como servicio. Permite implementar:

- **Single Sign-On (SSO)**
- **Federación con proveedores OAuth 2.0** (Google, GitHub, Microsoft, etc.)
- **Autenticación multifactor (MFA)**
- **Gestión de usuarios**
- **Tokens JWT seguros**

### ¿Por qué usar Auth0 en lugar de autenticación local?

| Autenticación Local | Auth0 |
|---------------------|-------|
| Almacenar passwords (riesgo) | Delegado a Google/Auth0 |
| Implementar hashing (bcrypt) | No necesario |
| Gestionar recuperación de contraseña | Automático |
| Cumplir normativas (GDPR, etc.) | Auth0 cumple por ti |
| Mantener seguridad actualizada | Auth0 se encarga |

---

## 🍪 Cookies: Antes vs Ahora

### Fase 11: Cookie manual `unir-cinema-session`

```javascript
// Cookie creada manualmente en el login
document.cookie = `unir-cinema-session=${JSON.stringify({
  username: "admin",
  name: "Administrador",
  role: "admin"
})}; path=/`;
```

**Problemas:**
- JSON en texto plano (visible en DevTools)
- Sin encriptación
- Sin expiración automática
- Vulnerable a manipulación

### Fase 12: Cookie Auth0 `__session`

```
Nombre: __session
Contenido: Token encriptado con AUTH0_SECRET
HttpOnly: Sí (no accesible desde JavaScript)
Secure: Sí en producción (solo HTTPS)
```

**Ventajas:**
- Token encriptado con `AUTH0_SECRET`
- HttpOnly (protección XSS)
- Secure en producción
- Expiración gestionada por Auth0
- Imposible de manipular sin la clave secreta

---

## 📁 Archivos Fundamentales

### 1. `src/lib/auth0.js` - Cliente Auth0

```javascript
import { Auth0Client } from '@auth0/nextjs-auth0/server';

export const auth0 = new Auth0Client();
```

Este cliente se usa en:
- **Proxy**: Para `auth0.middleware()` y `auth0.getSession()`
- **Route Handlers**: Para verificar sesión en `/api/v1/sync`
- **Server Components**: Para obtener datos del usuario

---

### 2. `src/app/api/v1/sync/route.js` - Sincronización con BD

```javascript
import { auth0 } from "@/lib/auth0";
import { findOrCreateUserFromAuth0 } from "../_store";


export async function POST(request) {
  const session = await auth0.getSession(request);
  
  if (!session) {
    return NextResponse.json({ error: "No hay sesion" }, { status: 401 });
  }

  // Crear usuario en BD si no existe
  const dbUser = await findOrCreateUserFromAuth0({
    email: session.user.email,
    name: session.user.name
  });

  // TODO: Obtener entradas de cine del usuario
  // const tickets = await getUserTickets(dbUser.id);

  return NextResponse.json({ success: true, user: dbUser });
}
```

**¿Por qué un Route Handler separado?**
- El proxy se ejecuta en **Edge Runtime** (no puede usar `pg`)
- Este endpoint usa **Node.js Runtime** para acceder a PostgreSQL
- Se llama **una sola vez** después del callback de Auth0

---

### 3. `src/app/(main)/auth-callback/page.js` - Página Post-Login

Esta página se muestra brevemente después del login con Auth0. Su función es:

1. Llamar a `POST /api/v1/sync` para sincronizar el usuario con PostgreSQL
2. Redirigir al usuario a su destino original (`returnTo`)

```javascript
'use client';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('syncing');

  useEffect(() => {
    async function syncUser() {
      const response = await fetch('/api/v1/sync', { method: 'POST' });
      
      if (response.ok) {
        setStatus('success');
        const returnTo = searchParams.get('returnTo') || '/';
        setTimeout(() => router.push(returnTo), 1500);
      } else {
        setStatus('error');
      }
    }
    syncUser();
  }, []);

  // UI con estados: syncing, success, error
}

// IMPORTANTE: useSearchParams requiere Suspense boundary
export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
```

> **Nota**: `useSearchParams()` requiere estar envuelto en un `<Suspense>` para evitar errores de prerendering en Next.js.

---

### 4. `src/proxy.js` - Proxy con Auth0

```javascript
export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Auth0 middleware procesa las rutas /auth/*
  const authResponse = await auth0.middleware(request);

  // Interceptar callback de Auth0 para pasar por /auth-callback
  if (pathname === '/auth/callback') {
    if (authResponse.status === 302 || authResponse.status === 307) {
      // Obtener destino original
      const location = authResponse.headers.get('location');
      const originalReturnTo = location ? new URL(location, request.url).pathname : '/';

      // Redirigir a nuestra página de sync
      const authCallbackUrl = new URL('/auth-callback', request.url);
      authCallbackUrl.searchParams.set('returnTo', originalReturnTo);

      // IMPORTANTE: Copiar las cookies de Auth0 a la nueva respuesta
      const response = NextResponse.redirect(authCallbackUrl);
      const setCookieHeader = authResponse.headers.get('set-cookie');
      if (setCookieHeader) {
        response.headers.set('set-cookie', setCookieHeader);
      }

      return response;
    }
    return authResponse;
  }

  // Rutas de Auth0 pasan directamente
  if (pathname.startsWith('/auth/')) {
    return authResponse;
  }

  // Proteger rutas que requieren autenticación
  if (isProtectedPath(pathname)) {
    const session = await auth0.getSession(request);
    if (!session) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('returnTo', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return authResponse;
}
```

**Puntos clave:**
- Llama a `auth0.middleware()` **una sola vez** para evitar errores de intercambio de código
- Intercepta la redirección del callback (302/307) para ir a `/auth-callback`
- **Copia las cookies de Auth0** a la nueva respuesta (crítico para mantener la sesión)
- Protege rutas con `auth0.getSession()`

---

### 5. `src/context/AuthContext.jsx` - Contexto con useUser

```javascript
import { useUser } from '@auth0/nextjs-auth0';

export const AuthProvider = ({ children }) => {
  const { user: auth0User, error, isLoading } = useUser();

  // Mapear usuario de Auth0 a estructura esperada
  const user = auth0User ? {
    name: auth0User.name || auth0User.email?.split('@')[0],
    email: auth0User.email,
    role: 'user',  // El rol se obtiene de la BD, no de Auth0
    picture: auth0User.picture
  } : null;

  return (
    <AuthContext.Provider value={{ user, error, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

> **Nota sobre polling**: El hook `useUser()` de Auth0 hace peticiones periódicas a `/auth/profile` para verificar el estado de la sesión. Esto es comportamiento normal del SDK.

---

## 🔄 Rutas de Auth0

Auth0 SDK genera automáticamente estas rutas:

| Ruta | Descripción |
|------|-------------|
| `/auth/login` | Inicia flujo OAuth → redirige a Google |
| `/auth/logout` | Cierra sesión y elimina cookie `__session` |
| `/auth/callback` | Callback de Google → establece cookie → **interceptado por proxy** |
| `/auth/profile` | Devuelve datos del usuario (usado por `useUser()`) |

---

## 🔁 Flujo de Autenticación Completo

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Usuario intenta acceder a /admin (ruta protegida)            │
│    └─> Proxy detecta que no hay sesión                          │
│    └─> Redirige a /auth/login?returnTo=/admin                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. Auth0 redirige a Google                                      │
│    └─> accounts.google.com/oauth2/...                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. Usuario se autentica en Google                               │
│    └─> Introduce email/contraseña de su cuenta Google           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. Google redirige a /auth/callback                             │
│    └─> Auth0 SDK procesa y establece cookie __session           │
│    └─> Proxy intercepta el redirect de Auth0                    │
│    └─> Copia las cookies y redirige a /auth-callback            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. Página /auth-callback (Client Component)                     │
│    └─> Llama a POST /api/v1/sync                                │
│    └─> Sincroniza usuario con PostgreSQL (findOrCreateUser)     │
│    └─> Muestra "¡Bienvenido!"                                   │
│    └─> Redirige a /admin (returnTo original)                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. Usuario en /admin                                            │
│    └─> Proxy verifica sesión con auth0.getSession()             │
│    └─> Sesión válida → muestra contenido protegido              │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚙️ Configuración de Auth0

### 1. Crear aplicación en Auth0 Dashboard

1. Accede a [Auth0 Dashboard](https://manage.auth0.com/)
2. Crea una nueva aplicación: **Regular Web Application**
3. Configura las URLs:

| Campo | Valor |
|-------|-------|
| Allowed Callback URLs | `http://localhost:3000/auth/callback` |
| Allowed Logout URLs | `http://localhost:3000` |
| Allowed Web Origins | `http://localhost:3000` |

### 2. Habilitar Google como proveedor

1. En Auth0 Dashboard → **Authentication > Social**
2. Habilita **Google**
3. Configura Client ID y Secret de Google OAuth (o usa las credenciales de desarrollo de Auth0)

### 3. Variables de entorno

Crear `.env.local`:

```env
# PostgreSQL
DATABASE_URL=postgresql://unir_user:postgres@localhost:5432/unir_cinema

# Auth0
AUTH0_DOMAIN=tu-tenant.eu.auth0.com
AUTH0_CLIENT_ID=tu_client_id
AUTH0_CLIENT_SECRET=tu_client_secret
AUTH0_SECRET=genera_un_valor_aleatorio_de_32_caracteres
APP_BASE_URL=http://localhost:3000
```

> **Generar AUTH0_SECRET:** `openssl rand -hex 32`

---

## ⚠️ Errores Comunes

### "An error occurred while trying to exchange the authorization code"

**Causa**: El proxy está llamando a `auth0.middleware()` más de una vez para el callback.

**Solución**: Asegúrate de que el proxy solo llama a `auth0.middleware(request)` **una vez** y luego trabaja con la respuesta.

### "useSearchParams() should be wrapped in a suspense boundary"

**Causa**: Next.js requiere que `useSearchParams()` esté dentro de un `<Suspense>`.

**Solución**: Separar el componente en dos partes:
```javascript
function Content() {
  const searchParams = useSearchParams(); // Usa el hook
  // ...
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <Content />
    </Suspense>
  );
}
```

---

## 🔗 Prefetch Deshabilitado en Links

Todos los componentes `<Link>` de Next.js tienen la propiedad `prefetch={false}` configurada explícitamente. Esto es necesario porque:

- **Problema**: Next.js por defecto hace prefetch de las rutas enlazadas cuando el Link entra en el viewport. Esto provoca que el proxy (`src/proxy.js`) se ejecute para cada ruta prefetcheada, llamando a `auth0.getSession()` innecesariamente.

- **Consecuencia**: Las llamadas a `auth0.getSession()` generan cookies de transacción (`__txn_*`) que pueden acumularse y causar errores HTTP 431 (Request Header Fields Too Large).

- **Solución**: Desactivar el prefetch en todos los Links para que el proxy solo se ejecute cuando el usuario navega realmente a una ruta.

```jsx
// ❌ Incorrecto - genera llamadas innecesarias al proxy
<Link href="/movie/1/session/19:30">Ver sesión</Link>

// ✅ Correcto - el proxy solo se ejecuta al hacer clic
<Link href="/movie/1/session/19:30" prefetch={false}>Ver sesión</Link>
```

**Archivos afectados:**
- `src/components/Header.jsx`
- `src/components/Pelicula.jsx`
- `src/components/SessionButton.jsx`
- `src/components/SeatSelection.jsx`
- `src/app/(main)/page.js`
- `src/app/(main)/movie/[id]/MovieDetailsClient.jsx`
- `src/app/(main)/cinema/[city]/page.js`
- `src/app/(main)/cartelera/[city]/page.js`
- `src/app/(main)/not-found.js`
- `src/app/not-found.js`

---

## 🚀 Instalación y Uso

```bash
# Instalar dependencias
npm install

# Asegurar PostgreSQL corriendo con datos seed
psql -U unir_user -d unir_cinema -f database.sql

# Configurar .env.local con credenciales Auth0

# Desarrollo
npm run dev

# Build
npm run build

# Producción
npm start
```

---

## 📁 Estructura de Archivos Relevantes

```
src/
├── lib/
│   └── auth0.js                    # Cliente Auth0 (Server)
├── proxy.js                        # Proxy: auth0.middleware() + intercepción callback
├── app/
│   ├── providers.js                # Auth0Provider wrapper
│   ├── (main)/
│   │   ├── auth-callback/page.js   # POST /api/v1/sync + redirect (con Suspense)
│   │   └── profile/page.js         # Muestra perfil del usuario
│   └── api/v1/
│       ├── sync/route.js           # POST: findOrCreateUserFromAuth0()
│       └── _store.js               # Funciones de acceso a BD
├── context/
│   └── AuthContext.jsx             # useUser() de Auth0
└── components/
    └── Header.jsx                  # Avatar + links /auth/login, /auth/logout
```

---

## 🔗 Referencias

- [Auth0 Next.js SDK](https://auth0.com/docs/quickstart/webapp/nextjs) - Guía oficial
- [@auth0/nextjs-auth0](https://www.npmjs.com/package/@auth0/nextjs-auth0) - Paquete npm
- [Auth0 Dashboard](https://manage.auth0.com/) - Gestión de aplicaciones
- [Google OAuth en Auth0](https://auth0.com/docs/connections/social/google) - Configuración de Google
- [OAuth 2.0 Simplified](https://www.oauth.com/) - Entender OAuth 2.0

