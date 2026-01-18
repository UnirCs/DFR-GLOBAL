# Ejemplo de Autenticación con Auth0 en Next.js

Este proyecto es un **ejemplo mínimo y didáctico** de cómo implementar autenticación con Auth0 en una aplicación Next.js 15+ usando el App Router. Está basado en la [guía oficial de Quickstart de Auth0](https://auth0.com/docs/quickstart/webapp/nextjs).

---

## 📋 Descripción General

El proyecto demuestra:

- **Autenticación federada** con OAuth 2.0 mediante Auth0
- **Proxy de Next.js** para manejar rutas de autenticación
- **Server Components** para verificar sesión en el servidor
- **Client Components** para mostrar UI reactiva del usuario
- **Hook `useUser`** para acceder al estado del usuario en el cliente

---

## 🗂️ Estructura del Proyecto

```
src/
├── proxy.js                   # Proxy que delega a Auth0
├── lib/
│   └── auth0.js               # Cliente Auth0 (instancia singleton)
├── app/
│   ├── layout.js              # Layout raíz de la aplicación
│   ├── page.js                # Página principal (Server Component)
│   └── globals.css            # Estilos globales
└── components/
    ├── LoginButton.jsx        # Botón de login (Client Component)
    ├── LogoutButton.jsx       # Botón de logout (Client Component)
    └── Profile.jsx            # Perfil del usuario (Client Component)
```

---

## 🔐 Conceptos de Autenticación

### ¿Qué es OAuth 2.0?

**OAuth 2.0** es un protocolo de autorización que permite a una aplicación acceder a recursos de un usuario en otro servicio sin conocer sus credenciales. En lugar de compartir contraseñas, el usuario autoriza el acceso mediante un **token**.

### ¿Qué es Auth0?

**Auth0** es una plataforma de Identity-as-a-Service (IDaaS) que implementa OAuth 2.0 y OpenID Connect. Actúa como intermediario entre tu aplicación y proveedores de identidad (Google, GitHub, Microsoft, etc.).

### Flujo de Autenticación

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Usuario    │────▶│   Auth0      │────▶│   Google     │
│   (Browser)  │◀────│   (IdP)      │◀────│   (Provider) │
└──────────────┘     └──────────────┘     └──────────────┘
       │                    │
       │  1. Click Login    │
       │───────────────────▶│
       │                    │ 2. Redirect a Google
       │                    │──────────────────────▶
       │                    │ 3. Usuario se autentica
       │                    │◀──────────────────────
       │  4. Callback con   │
       │     código         │
       │◀───────────────────│
       │                    │
       │  5. Intercambio    │
       │     por token      │
       │───────────────────▶│
       │                    │
       │  6. Cookie de      │
       │     sesión         │
       │◀───────────────────│
```

---

## 📁 Archivos Fundamentales

### 1. `src/lib/auth0.js` - Cliente Auth0

```javascript
import { Auth0Client } from '@auth0/nextjs-auth0/server';

export const auth0 = new Auth0Client();
```

Este archivo crea una **instancia singleton** del cliente Auth0. Se importa en:
- El middleware para manejar rutas `/auth/*`
- Server Components para obtener la sesión

**¿Por qué singleton?** Para evitar crear múltiples conexiones y mantener consistencia en toda la aplicación.

---

### 2. `src/proxy.js` - Proxy de Autenticación

```javascript
import { auth0 } from "./lib/auth0";

export async function proxy(request) {
    return await auth0.middleware(request);
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
};
```

**¿Qué hace el proxy?**

El `auth0.middleware(request)` intercepta las peticiones y maneja automáticamente las rutas de autenticación:

| Ruta | Acción |
|------|--------|
| `/auth/login` | Inicia el flujo OAuth, redirige a Auth0/Google |
| `/auth/logout` | Cierra la sesión, elimina la cookie |
| `/auth/callback` | Recibe el código de autorización, lo intercambia por tokens y establece la cookie de sesión |
| `/auth/profile` | Devuelve los datos del usuario autenticado (JSON) |

**¿Qué es el `matcher`?**

El `matcher` define en qué rutas se ejecuta el proxy. La expresión regular excluye:
- `_next/static` - Archivos estáticos de Next.js
- `_next/image` - Imágenes optimizadas
- `favicon.ico`, `sitemap.xml`, `robots.txt` - Archivos de metadatos

---

### 3. `src/app/page.js` - Página Principal (Server Component)

```javascript
import { auth0 } from "@/lib/auth0";
import LoginButton from "@/components/LoginButton";
import LogoutButton from "@/components/LogoutButton";
import Profile from "@/components/Profile";

export default async function Home() {
  // Obtener sesión en el servidor
  const session = await auth0.getSession();
  const user = session?.user;

  return (
    <div>
      {user ? (
        // Usuario autenticado
        <>
          <Profile />
          <LogoutButton />
        </>
      ) : (
        // Usuario no autenticado
        <LoginButton />
      )}
    </div>
  );
}
```

**Puntos clave:**

- Es un **Server Component** (no tiene `'use client'`)
- Usa `auth0.getSession()` para verificar la sesión **en el servidor**
- Renderiza condicionalmente según el estado de autenticación
- Los datos del usuario nunca se exponen al cliente en el HTML inicial

---

### 4. `src/components/LoginButton.jsx` - Botón de Login

```javascript
"use client";

export default function LoginButton() {
    return (
        <a href="/auth/login">
            Log In
        </a>
    );
}
```

**¿Por qué es Client Component?**

Aunque solo renderiza un enlace, está marcado como `"use client"` porque:
- Podría necesitar interactividad en el futuro (onClick, estados, etc.)
- Es una práctica común para componentes de UI reutilizables

**¿Cómo funciona?**

El enlace a `/auth/login` es interceptado por el proxy, que inicia el flujo OAuth.

---

### 5. `src/components/LogoutButton.jsx` - Botón de Logout

```javascript
"use client";

export default function LogoutButton() {
    return (
        <a href="/auth/logout">
            Log Out
        </a>
    );
}
```

Similar al botón de login, enlaza a `/auth/logout` que es manejado por el proxy para cerrar la sesión.

---

### 6. `src/components/Profile.jsx` - Perfil del Usuario

```javascript
"use client";

import { useUser } from "@auth0/nextjs-auth0/client";

export default function Profile() {
    const { user, isLoading } = useUser();

    if (isLoading) {
        return <div>Loading user profile...</div>;
    }

    if (!user) {
        return null;
    }

    return (
        <div>
            <img src={user.picture} alt={user.name} />
            <h2>{user.name}</h2>
            <p>{user.email}</p>
        </div>
    );
}
```

**¿Qué es `useUser()`?**

Es un hook de Auth0 que:
- Obtiene los datos del usuario desde `/auth/profile`
- Proporciona estados de carga (`isLoading`)
- Se actualiza automáticamente cuando cambia la sesión

**Datos disponibles en `user`:**

| Propiedad | Descripción |
|-----------|-------------|
| `user.name` | Nombre completo del usuario |
| `user.email` | Email del usuario |
| `user.picture` | URL del avatar (de Google, GitHub, etc.) |
| `user.sub` | ID único del usuario en Auth0 |
| `user.email_verified` | Si el email está verificado |

---

## 🍪 Cookie de Sesión

Auth0 gestiona la autenticación mediante una cookie llamada `__session`:

| Propiedad | Valor |
|-----------|-------|
| **Nombre** | `__session` |
| **Contenido** | Token JWT encriptado |
| **HttpOnly** | Sí (no accesible desde JavaScript) |
| **Secure** | Sí en producción (solo HTTPS) |
| **Encriptación** | Con `AUTH0_SECRET` |

**Ventajas:**
- Imposible de manipular sin la clave secreta
- Protegido contra ataques XSS (HttpOnly)
- Expira automáticamente según configuración de Auth0

---

## ⚙️ Configuración

### 1. Crear aplicación en Auth0

1. Accede a [Auth0 Dashboard](https://manage.auth0.com/)
2. Crea una aplicación: **Regular Web Application**
3. Configura las URLs:

| Campo | Valor |
|-------|-------|
| Allowed Callback URLs | `http://localhost:3000/auth/callback` |
| Allowed Logout URLs | `http://localhost:3000` |
| Allowed Web Origins | `http://localhost:3000` |

### 2. Variables de entorno

Crear `.env.local`:

```env
AUTH0_DOMAIN=tu-tenant.eu.auth0.com
AUTH0_CLIENT_ID=tu_client_id
AUTH0_CLIENT_SECRET=tu_client_secret
AUTH0_SECRET=genera_un_valor_aleatorio_de_32_caracteres
APP_BASE_URL=http://localhost:3000
```

> **Generar AUTH0_SECRET:** `openssl rand -hex 32`

### 3. Habilitar proveedores sociales (opcional)

En Auth0 Dashboard → **Authentication > Social**:
- Habilita **Google**, **GitHub**, **Microsoft**, etc.
- Configura las credenciales OAuth de cada proveedor

---

## 🚀 Instalación y Uso

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno (.env.local)

# Ejecutar en desarrollo
npm run dev

# Abrir http://localhost:3000
```

---

## 📊 Comparativa: Server vs Client

| Aspecto | Server Component | Client Component |
|---------|------------------|------------------|
| **Obtener sesión** | `auth0.getSession()` | `useUser()` hook |
| **Cuándo se ejecuta** | En el servidor, antes de enviar HTML | En el navegador, después de hidratar |
| **Acceso a datos** | Directo, sin fetch adicional | Hace fetch a `/auth/profile` |
| **Uso típico** | Verificar acceso, proteger rutas | Mostrar UI reactiva, avatar |

---

## 🔒 Proteger Rutas

Para proteger una ruta y requerir autenticación:

```javascript
// app/dashboard/page.js
import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth0.getSession();
  
  if (!session) {
    redirect("/auth/login");
  }

  return <div>Contenido protegido para {session.user.name}</div>;
}
```

---

## 📦 Dependencias

```json
{
  "dependencies": {
    "@auth0/nextjs-auth0": "^4.14.0",
    "next": "16.1.1",
    "react": "19.2.3",
    "react-dom": "19.2.3"
  }
}
```

La única dependencia adicional es `@auth0/nextjs-auth0`, que proporciona:
- `Auth0Client` para el servidor
- `useUser` hook para el cliente
- Proxy automático para rutas `/auth/*`

---

## 🔗 Referencias

### Documentación Oficial
- [Auth0 Next.js Quickstart](https://auth0.com/docs/quickstart/webapp/nextjs) - Guía paso a paso
- [@auth0/nextjs-auth0 en npm](https://www.npmjs.com/package/@auth0/nextjs-auth0) - Documentación del SDK
- [Auth0 Dashboard](https://manage.auth0.com/) - Gestión de aplicaciones

### Conceptos de Autenticación
- [OAuth 2.0 Simplified](https://www.oauth.com/) - Guía completa de OAuth
- [OpenID Connect](https://openid.net/connect/) - Capa de identidad sobre OAuth
- [JWT.io](https://jwt.io/) - Decodificar y verificar tokens JWT

### Next.js
- [Next.js Proxy (Middleware)](https://nextjs.org/docs/app/building-your-application/routing/middleware) - Documentación oficial
- [Next.js Authentication](https://nextjs.org/docs/app/building-your-application/authentication) - Patrones de autenticación

---

## ⚠️ Notas Importantes

1. **AUTH0_SECRET**: Debe ser una cadena aleatoria de al menos 32 caracteres. Úsala para encriptar las cookies de sesión.

2. **Producción**: Asegúrate de:
   - Usar HTTPS
   - Configurar las URLs de callback/logout correctas
   - No exponer las variables de entorno

3. **useUser() y polling**: El hook `useUser()` hace peticiones periódicas a `/auth/profile`. Esto es normal y mantiene la sesión sincronizada.

4. **Proxy en Next.js 16+**: A partir de Next.js 16, el archivo se llama `proxy.js` con la función `proxy()`. En versiones anteriores (Next.js 15 y anteriores) se usaba `middleware.js` con la función `middleware()`.

