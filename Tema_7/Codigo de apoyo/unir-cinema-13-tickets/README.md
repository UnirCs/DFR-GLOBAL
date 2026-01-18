# UNIR Cinema - Sistema de Venta de Entradas

Este proyecto implementa un sistema completo de venta de entradas de cine con autenticación OAuth2 (Auth0), persistencia en PostgreSQL y generación de códigos QR para las órdenes.

## Funcionalidades Implementadas

### 1. Sistema de Compra de Entradas

El flujo de compra de entradas funciona de la siguiente manera:

1. **Navegación por cartelera**: El usuario accede a `/cartelera/[ciudad]` para ver las películas disponibles
2. **Selección de película y horario**: Al hacer clic en un horario, se navega a la página de selección de asientos
3. **Selección de asientos**: El usuario puede seleccionar múltiples asientos disponibles
4. **Modal de pago**: Al confirmar la reserva, aparece un modal con formulario de pago
5. **Procesamiento**: Se validan los datos y se crea la orden en base de datos
6. **Redirección**: Tras 2 segundos del pago exitoso, se redirige al perfil

### 2. Visualización de Órdenes con QR

En la página de perfil (`/profile`) el usuario puede ver:

- Información de su cuenta (nombre, email, rol)
- Listado de todas sus órdenes de compra
- Para cada orden:
  - Película, cine, fecha y hora de la sesión
  - Asientos comprados
  - Formato de la sesión (IMAX, 3D, etc.)
  - Importe total
  - **Código QR** para presentar en taquilla

---

## Archivos Añadidos

### Route Handler de Órdenes
**`src/app/api/v1/orders/route.js`**

Endpoints REST para gestionar órdenes:

- `GET /api/v1/orders` - Obtiene las órdenes del usuario autenticado
- `POST /api/v1/orders` - Crea una nueva orden con sus tickets

El endpoint POST espera el siguiente body:
```json
{
  "screeningId": 1,
  "seats": ["A1", "A2", "A3"],
  "paymentData": {
    "cardName": "Usuario Demo",
    "cardNumber": "4111 1111 1111 1111",
    "cardExpiry": "12/28",
    "cardCvv": "123"
  }
}
```

### Componente OrderCard
**`src/app/(main)/profile/OrderCard.jsx`**

Componente cliente que muestra una tarjeta con:
- Información de la orden (película, cine, fecha, hora, asientos)
- Estado de la orden (pagado, pendiente, cancelado, reembolsado)
- Código QR generado con la librería `qrcode.react`
- **Botón para descargar el QR** como imagen PNG al dispositivo
- El QR contiene un JSON con todos los datos de la orden

---

## Archivos Modificados

### Store de Base de Datos
**`src/app/api/v1/_store.js`**

Nuevas funciones añadidas:

- `getUserOrders(userId)`: Obtiene todas las órdenes de un usuario con sus tickets y detalles completos (película, cine, sala, horario)
- `getScreeningByMovieAndTime(movieId, cityName, showTime)`: Obtiene los datos de una sesión específica por película, ciudad y hora

### API Server (funciones para Server Components)
**`src/lib/api-server.js`**

Nuevas funciones añadidas:

- `getUserOrdersFromStore(userId)`: Wrapper para obtener órdenes directamente en Server Components
- `getScreeningFromStore(movieId, cityName, showTime)`: Wrapper para obtener datos de sesión

### Página de Sesión (Selección de Asientos)
**`src/app/(main)/movie/[id]/session/[time]/page.js`**

Modificaciones:
- Añadido soporte para `searchParams` con ciudad
- Obtención del `screeningId` desde base de datos
- Paso del precio real de la sesión al componente cliente

### Componente de Selección de Asientos
**`src/app/(main)/movie/[id]/session/[time]/SeatSelectionClient.jsx`**

Componente completamente reescrito con:
- Modal de pago con formulario completo
- Datos de pago precargados para facilitar pruebas
- Validación de formulario
- Estados de procesamiento y éxito
- Redirección automática al perfil tras compra exitosa

### Página de Perfil
**`src/app/(main)/profile/page.js`**

Modificaciones:
- Añadido `dynamic = 'force-dynamic'` para desactivar cache
- Obtención de órdenes del usuario desde base de datos
- Renderizado de la sección de órdenes con tarjetas QR
- Mensaje informativo cuando no hay órdenes

### Detalles de Película
**`src/app/(main)/movie/[id]/MovieDetailsClient.jsx`**

Modificación menor:
- Los links a sesiones ahora incluyen `?city=` para pasar la ciudad

---

## Dependencias Añadidas

```bash
npm install qrcode.react
```

La librería `qrcode.react` permite generar códigos QR como componentes React (SVG o Canvas).

---

## Consideraciones Importantes

### 1. Autenticación Requerida

La página de selección de asientos está protegida por el proxy (`src/proxy.js`). El usuario debe estar autenticado para acceder.

### 2. Sesiones de la Base de Datos

Las sesiones (screenings) se filtran por la fecha actual del sistema. En el Header existe un botón para actualizar todas las sesiones a la fecha de hoy, lo que permite probar el sistema en cualquier momento.

### 3. Datos de Pago de Prueba

El formulario de pago viene precargado con datos válidos para facilitar las pruebas:
- **Nombre**: Usuario Demo
- **Número de tarjeta**: 4111 1111 1111 1111
- **Caducidad**: 12/28
- **CVV**: 123

La validación del pago es simulada (siempre exitosa con datos válidos).

### 4. Generación y Descarga de QR

El código QR contiene un JSON con:
```json
{
  "orderId": 1,
  "movie": "Título de la película",
  "date": "2026-01-11",
  "time": "17:30",
  "seats": "A1, A2",
  "cinema": "UNIR Cinema Madrid",
  "total": 25.00
}
```

El usuario puede descargar el QR como imagen PNG (300x300 píxeles) haciendo clic en el botón "📥 Descargar QR". El archivo se descarga con el nombre `entrada-unir-cinema-orden-{id}.png`.

### 5. Cache Deshabilitado en Perfil

La página de perfil usa `dynamic = 'force-dynamic'` para asegurar que siempre muestre las órdenes actualizadas sin cache.

### 6. Manejo de Asientos Ocupados

Si un usuario intenta comprar un asiento que ya fue vendido (constraint UNIQUE en la tabla tickets), el sistema devuelve un error 409 con mensaje informativo.

### 7. Prefetch Deshabilitado en Links

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

## Flujo Técnico de la Compra

```
1. Usuario en /cartelera/[city]
   ↓
2. Selecciona película → /movie/[id]?city=[city]
   ↓
3. Selecciona horario → /movie/[id]/session/[time]?city=[city]
   ↓
4. Server Component obtiene screeningId de BD
   ↓
5. Cliente muestra asientos, usuario selecciona
   ↓
6. Click "Confirmar Reserva" → Modal de pago
   ↓
7. Submit formulario → POST /api/v1/orders
   ↓
8. Backend valida, crea orden + tickets en transacción
   ↓
9. Respuesta exitosa → Estado de éxito en modal
   ↓
10. Después de 2s → router.push('/profile')
    ↓
11. Perfil muestra orden con QR
    ↓
12. Usuario puede descargar QR como PNG
```

---

## Variables de Entorno Requeridas

```env
DATABASE_URL=postgresql://user:password@host:port/database
AUTH0_SECRET=...
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
AUTH0_CLIENT_ID=...
AUTH0_CLIENT_SECRET=...
```

---

## Ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
npm start
```

---

## Estructura de Base de Datos Relevante

```sql
-- Órdenes
CREATE TABLE orders (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    status TEXT NOT NULL CHECK (status IN ('pending','paid','cancelled','refunded')),
    total_amount NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tickets
CREATE TABLE tickets (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    screening_id BIGINT NOT NULL REFERENCES screenings(id),
    seat_label TEXT NOT NULL,
    price_paid NUMERIC(6,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (screening_id, seat_label) -- Un asiento solo puede venderse una vez por sesión
);
```

