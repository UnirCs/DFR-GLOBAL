import { NextResponse } from 'next/server';

/**
 * proxy de Next.js para proteccion de rutas
 *
 * Este proxy se ejecuta en el servidor ANTES de que la pagina se renderice.
 * Verifica si el usuario esta autenticado mediante una cookie de sesion.
 * Si no lo esta, redirige a /login con el parametro ?from para recordar
 * la ruta a la que intentaba acceder.
 *
 * Ventajas sobre el componente PrivateRoute:
 * - Se ejecuta en el servidor, no en el cliente
 * - La redireccion ocurre antes de cargar cualquier JavaScript
 * - Mejor rendimiento y experiencia de usuario
 * - Protege las rutas incluso si JavaScript esta deshabilitado
 */

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
    // Convertir el patron a una expresion regular
    // * coincide con cualquier segmento de ruta (uno o mas caracteres sin /)
    const regexPattern = pattern
      .replace(/\*/g, '[^/]+')
      .replace(/\//g, '\\/');

    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(pathname);
  });
}

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // Verificar si la ruta actual requiere autenticacion
  if (isProtectedPath(pathname)) {
    // Obtener la cookie de sesion
    const sessionCookie = request.cookies.get('unir-cinema-session');

    // Si no hay cookie de sesion, redirigir a login
    if (!sessionCookie) {
      const loginUrl = new URL('/login', request.url);
      // Agregar el parametro ?from para recordar la ruta original
      loginUrl.searchParams.set('from', pathname);

      return NextResponse.redirect(loginUrl);
    }

    // Verificar que la cookie tenga un valor valido (no vacio)
    try {
      const sessionData = JSON.parse(sessionCookie.value);
      if (!sessionData || !sessionData.username) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
      }
    } catch {
      // Cookie invalida o corrupta, redirigir a login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Continuar con la peticion normalmente
  return NextResponse.next();
}

// Configuracion del proxy: rutas donde se ejecutara
export const config = {
  matcher: [
    // Ejecutar en todas las rutas excepto archivos estaticos y API
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
