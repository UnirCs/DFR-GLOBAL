import { NextResponse } from 'next/server';
import { auth0 } from "./lib/auth0";

// Rutas que requieren autenticacion
const protectedPaths = [
  '/admin',
  '/movie/*/session/*'
];

/**
 * Verifica si una ruta coincide con un patron protegido
 * Soporta wildcards (*) para segmentos dinamicos
 */
function isProtectedPath(pathname) {
  return protectedPaths.some(pattern => {
    const regexPattern = pattern
      .replace(/\*/g, '[^/]+')
      .replace(/\//g, '\\/');
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(pathname);
  });
}

export async function proxy(request) {
  const { pathname, searchParams } = request.nextUrl;

  // Dejar que Auth0 maneje sus rutas (/auth/login, /auth/logout, /auth/callback)
  const authResponse = await auth0.middleware(request);

  // Si estamos en el callback de Auth0, interceptar la redireccion
  // para enviar primero a /auth-callback
  if (pathname === '/auth/callback') {
    // Auth0 ya proceso el callback, ahora verificamos si va a redirigir
    if (authResponse.status === 302 || authResponse.status === 307) {
      // Obtener el destino original de Auth0
      const location = authResponse.headers.get('location');
      const originalReturnTo = location ? new URL(location, request.url).pathname : '/';

      // Redirigir a nuestra pagina de sync con el destino original
      const authCallbackUrl = new URL('/auth-callback', request.url);
      authCallbackUrl.searchParams.set('returnTo', originalReturnTo);

      // Copiar las cookies de Auth0 (importantes para la sesion)
      const response = NextResponse.redirect(authCallbackUrl);

      // Copiar todas las cookies de la respuesta de Auth0
      const setCookieHeader = authResponse.headers.get('set-cookie');
      if (setCookieHeader) {
        response.headers.set('set-cookie', setCookieHeader);
      }

      return response;
    }
    return authResponse;
  }

  // Si estamos en otras rutas de Auth0, dejarlas pasar
  if (pathname.startsWith('/auth/')) {
    return authResponse;
  }

  // Si Auth0 devuelve una respuesta de redireccion, usarla
  if (authResponse.status !== 200) {
    return authResponse;
  }

  // Verificar si la ruta actual requiere autenticacion
  if (isProtectedPath(pathname)) {
    const session = await auth0.getSession(request);

    // Si no hay sesion, redirigir a Auth0 login
    if (!session) {
      const loginUrl = new URL('/auth/login', request.url);
      // Auth0 usa returnTo para redirigir despues del login
      loginUrl.searchParams.set('returnTo', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return authResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
