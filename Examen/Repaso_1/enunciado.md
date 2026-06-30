# UnirStay - Enunciado

Un equipo de desarrollo ha construido UnirStay, una aplicación web de reserva de alojamientos vacacionales (estilo Airbnb). La aplicación se implementa con Next.js 16 (App Router), PostgreSQL, TailwindCSS v4 y autenticación con Auth0 (OAuth 2.0).


## Descripción general

UnirStay permite explorar alojamientos por destino, consultar detalles de propiedades, realizar reservas con calendario de disponibilidad y gestionar un historial de estancias. Los usuarios se registran mediante Google a través de Auth0. La aplicación está internacionalizada (español, inglés, francés) y optimizada para SEO.


## Estructura de rutas

```
src/app/
  layout.js              # Root layout
  not-found.js           # 404 global
  global-error.js        # Error handler global
  robots.js              # SEO
  sitemap.js             # SEO
  providers.js           # Client Component con providers
  [lang]/
    layout.js            # Layout con TranslationsProvider
    (main)/
      layout.js          # Layout con Header y Footer
      not-found.js       # 404 del grupo
      page.js            # Landing
      about/page.js      # Sobre nosotros
      admin/page.js      # Panel admin (protegido)
      profile/page.js    # Perfil usuario
      auth-callback/page.js  # Post-login, sincroniza con BD
      stays/[destination]/
        page.js           # Listado alojamientos
        loading.js        # Skeleton de carga
        DestinationSyncClient.jsx
        StayList.jsx
      stay/[id]/
        layout.js
        page.js           # Detalle alojamiento
        StayDetailsClient.jsx
        room/[roomId]/page.js
      booking/[id]/page.js
  api/v1/
    _db.js               # Pool PostgreSQL (singleton)
    _store.js             # Funciones de acceso a datos (async)
    stays/route.js
    stays/[stay]/rooms/route.js
    rooms/[idRoom]/route.js
    bookings/route.js
    metrics/route.js
    sync/route.js
```

Se usa un Route Group `(main)` para compartir layout sin afectar la URL. El segmento `[lang]` gestiona la internacionalización. Las rutas dinámicas `[destination]`, `[id]`, `[roomId]` capturan parámetros de la URL.


## Back-End integrado de la aplicación

La aplicación usa PostgreSQL como base de datos relacional, conectando mediante el paquete `pg` (node-postgres) con un pool de conexiones reutilizable creado como singleton en `_db.js`. Este archivo expone `query(text, params)` para consultas simples y `withTransaction(fn)` para operaciones transaccionales con rollback automático en caso de error.

Las tablas principales son: `stays`, `rooms`, `users`, `bookings`, `booking_items` y `destinations`. Para la internacionalización, existen tablas de traducciones (`stays_translations`, `rooms_translations`) con restricción `UNIQUE(entity_id, locale)`.

El paquete `pg` usa APIs nativas de Node.js (`net`, `tls`, `dns`) que no están disponibles en Edge Runtime. Node.js es el runtime por defecto en los Route Handlers y Server Components de Next.js.

Los Route Handlers se definen en archivos `route.js` dentro de `api/v1/`. Usan la API estándar de `Request` y `Response` (Web Standards) y se ejecutan en el servidor. Los archivos con prefijo `_` (como `_db.js`, `_store.js`) son módulos privados y no se exponen como endpoints.

Endpoints principales:
- `GET /api/v1/stays` (acepta query params `?destination=` y `?rating=top`)
- `GET /api/v1/stays/[stay]/rooms`
- `GET /api/v1/rooms/[idRoom]`
- `POST /api/v1/bookings` (crea reserva con transacción atómica)
- `GET /api/v1/bookings` (reservas del usuario autenticado)
- `GET /api/v1/metrics`
- `POST /api/v1/sync` (sincroniza usuario Auth0 con BD)

Para acceder a datos, la aplicación tiene dos módulos:
- `lib/api.js`: funciones que hacen `fetch` a los Route Handlers. Usadas por Server Components en runtime y por Client Components.
- `lib/api-server.js`: acceso directo a la BD importando `_store.js`. Usadas por `generateStaticParams` y Server Components en build time, cuando no hay servidor HTTP corriendo.

Los Client Components no pueden acceder a la base de datos directamente; solo pueden hacer `fetch` a los Route Handlers.
