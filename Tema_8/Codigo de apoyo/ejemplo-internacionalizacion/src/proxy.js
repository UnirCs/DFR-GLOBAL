import { NextResponse } from "next/server";

const locales = ["es", "en", "fr"];
const defaultLocale = "es";

function getLocale(request) {
  // Detecta el idioma preferido del usuario desde Accept-Language
  const acceptLanguage = request.headers.get("accept-language") || "";

  // Busca si algún locale soportado está en Accept-Language
  for (const locale of locales) {
    if (acceptLanguage.toLowerCase().includes(locale)) {
      return locale;
    }
  }

  return defaultLocale;
}

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // Evitar interceptar assets internos, API routes y archivos estáticos
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // archivos estáticos como .svg, .ico, etc.
  ) {
    return;
  }

  // Verificar si el path ya tiene un locale válido
  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (pathnameHasLocale) return;

  // Redirigir al locale detectado
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\.).*)"],
};

