# Preguntas de Repaso - UnirStay


## Pregunta 1

El equipo revisa la estructura de rutas del proyecto. Dada la siguiente ubicación de un archivo:

```
src/app/[lang]/(main)/stays/[destination]/page.js
```

Si un usuario navega a la URL `/es/stays/barcelona`, ¿qué valor tendrá `params.destination` dentro del componente de esa página?

A) `"stays"` porque es el segmento padre inmediato de `[destination]`.

B) No se puede acceder a `params.destination` porque `(main)` es un Route Group y rompe la cadena de parámetros.

C) `"barcelona"` porque `[destination]` es un segmento dinámico que captura ese fragmento de la URL, y el Route Group `(main)` no afecta a la URL ni a los parámetros.

D) `undefined` porque `params` solo contiene `lang` y el resto de segmentos se obtiene vía `searchParams`.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: C**

**¿Por qué es correcta?**  
Los segmentos dinámicos (`[destination]`) capturan el valor correspondiente de la URL. Los Route Groups (`(main)`) no generan segmentos de URL, por lo que no rompen la propagación de parámetros ni afectan a `params`.

**¿Por qué las demás no lo son?**
- **A)** `"stays"` es un segmento estático de la ruta, no un segmento dinámico. `params` solo contiene los valores de los segmentos dinámicos (`[lang]`, `[destination]`), no los nombres de carpetas estáticas.
- **B)** Los Route Groups (`(main)`) no rompen la cadena de parámetros. No generan segmentos de URL ni afectan a `params`; solo agrupan rutas para compartir layout.
- **D)** `params` contiene todos los segmentos dinámicos de la ruta (`lang`, `destination`). `searchParams` se usa para query strings (`?key=value`), no para parámetros de ruta.

</details>


## Pregunta 2

Un desarrollador junior añade un nuevo componente para el selector de huéspedes en la reserva:

```jsx
import { useState } from 'react';

export default function GuestSelector({ roomId, onGuestChange }) {
  const [guests, setGuests] = useState(1);

  const handleChange = (delta) => {
    const newGuests = Math.max(1, guests + delta);
    setGuests(newGuests);
    onGuestChange(roomId, newGuests);
  };

  return (
    <div>
      <button onClick={() => handleChange(-1)}>-</button>
      <span>{guests}</span>
      <button onClick={() => handleChange(1)}>+</button>
    </div>
  );
}
```

El componente falla en tiempo de ejecución. ¿Cuál es la causa?

A) Falta la directiva `'use client'` al inicio del archivo. Por defecto los componentes en App Router son Server Components, y `useState` no está disponible en el servidor.

B) El error está en que `useState` no acepta un número como valor inicial; debería ser `useState("1")`.

C) `onGuestChange` no puede pasarse como prop a un Server Component porque las funciones no son serializables.

D) El problema es que `Math.max` no está disponible en Server Components porque es una API exclusiva del navegador.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: A**

**¿Por qué es correcta?**  
En App Router, todos los componentes son Server Components por defecto. `useState` es un hook de React que solo funciona en Client Components, por lo que es obligatorio añadir la directiva `'use client'` al inicio del archivo.

**¿Por qué las demás no lo son?**
- **B)** `useState` acepta cualquier tipo de valor inicial, incluidos números, strings, arrays y objetos.
- **C)** Aunque es cierto que las funciones no son serializables como props de Server Component a Client Component, aquí el componente es Server Component por defecto y por tanto no puede usar hooks en absoluto. El error principal es la falta de `'use client'`.
- **D)** `Math.max` es una API estándar de JavaScript disponible tanto en Node.js como en el navegador. No es exclusiva del navegador.

</details>



## Pregunta 3

El equipo configura el componente `Image` para las fotos de los alojamientos en la página principal:

```jsx
import Image from 'next/image';

<div style={{ position: 'relative', width: '100%', height: '250px' }}>
  <Image
    src="/stay-photo.jpg"
    alt="Foto del alojamiento"
    fill
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    priority={index < 3}
  />
</div>
```

¿Qué efecto tiene `priority={index < 3}` en este componente?

A) Desactiva la optimización automática de imágenes para las tres primeras instancias.

B) Activa la carga prioritaria (sin lazy loading) para las tres primeras imágenes, lo que mejora el LCP al cargarlas inmediatamente en lugar de esperar a que entren en el viewport.

C) Fuerza a que las tres primeras imágenes se rendericen en el servidor y las demás en el cliente.

D) Hace que las tres primeras imágenes tengan más resolución que las demás porque Next.js les asigna más ancho de banda.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: B**

**¿Por qué es correcta?**  
La propiedad `priority` en `next/image` desactiva el lazy loading para las imágenes marcadas, cargándolas inmediatamente. Esto es crucial para las imágenes "above the fold" que impactan el LCP (Largest Contentful Paint).

**¿Por qué las demás no lo son?**
- **A)** `priority` no desactiva la optimización automática; sigue optimizando el formato, tamaño y compresión.
- **C)** `priority` no controla dónde se renderiza la imagen (SSR vs CSR). Todas las imágenes con `next/image` se optimizan en el servidor.
- **D)** Next.js no asigna más ancho de banda ni resolución basándose en `priority`. La resolución se controla mediante `sizes` y el ancho de la imagen.

</details>



## Pregunta 4

El equipo define colores personalizados en `globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-stay-sand: #f5f0e8;
  --color-stay-sand-dark: #e6dcc8;
  --color-stay-teal: #00a699;
}
```

Luego en un componente JSX se escribe:

```jsx
<button className="bg-stay-teal hover:bg-stay-teal-dark text-white">
  Reservar ahora
</button>
```

¿Por qué funcionan estas clases sin definir un archivo `tailwind.config.js`?

A) Porque Tailwind siempre acepta cualquier nombre de clase sin configuración; si no reconoce la clase, la genera como vacía.

B) Porque en TailwindCSS v4 la directiva `@theme` registra automáticamente las variables CSS como tokens de color que generan clases utilitarias (`bg-*`, `text-*`, `border-*`, etc.) sin necesidad de archivo de configuración.

C) Porque `bg-stay-teal` no es una clase de Tailwind sino una clase CSS normal que el navegador interpreta por el nombre de la variable.

D) No funcionan. Es necesario definir un `tailwind.config.js` con `extend.colors` para que Tailwind reconozca colores personalizados, incluso en la versión 4.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: B**

**¿Por qué es correcta?**  
TailwindCSS v4 introduce la directiva `@theme`, que registra variables CSS como tokens de diseño. Esto genera automáticamente las clases utilitarias (`bg-stay-teal`, `text-stay-teal`, etc.) sin necesidad de un archivo `tailwind.config.js`.

**¿Por qué las demás no lo son?**
- **A)** Tailwind no acepta cualquier clase arbitraria. Si la clase no está definida en su sistema de tokens, no genera ningún CSS para ella (no la "genera como vacía", simplemente no la procesa).
- **C)** `bg-stay-teal` es efectivamente una clase generada por Tailwind a partir del token definido en `@theme`, no una clase CSS nativa arbitraria.
- **D)** En TailwindCSS v4, `@theme` es la forma nativa de definir tokens sin `tailwind.config.js`. Esta afirmación describe el comportamiento de Tailwind v3, no v4.

</details>



## Pregunta 5

El equipo implementa la función `getDestinations()` en `lib/api.js`:

```js
export async function getDestinations() {
  const response = await fetch(`${API_BASE_URL}/api/v1/stays`, {
    cache: 'force-cache',
    next: { tags: ['destinations'] }
  });
  return response.json();
}
```

Si el equipo necesita que la lista de destinos se actualice después de añadir un nuevo destino a la base de datos, sin hacer un nuevo build, ¿qué debe hacer?

A) Llamar a `revalidateTag('destinations')` desde una Server Action. Esto invalida el caché de todos los fetches que tienen el tag `'destinations'`, y la siguiente petición obtendrá datos frescos.

B) No es posible. Con `force-cache` el dato solo se actualiza haciendo un nuevo `npm run build`.

C) Cambiar `force-cache` por `no-store` para que siempre vaya a la base de datos en cada petición.

D) Llamar a `fetch` con `cache: 'reload'` desde un Client Component para forzar la recarga.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: A**

**¿Por qué es correcta?**  
`revalidateTag` invalida explícitamente el caché de todos los fetches que usen ese tag, permitiendo obtener datos frescos en la siguiente petición sin necesidad de rebuild. Es el mecanismo recomendado en Next.js para invalidación manual del caché.

**¿Por qué las demás no lo son?**
- **B)** `force-cache` no requiere un nuevo build para actualizarse. `revalidateTag` puede invalidarlo en runtime.
- **C)** Cambiar a `no-store` eliminaría completamente el caché, lo que penalizaría el rendimiento al evitar cualquier reutilización de datos. No es la solución óptima.
- **D)** `cache: 'reload'` solo afecta a la petición del Client Component que lo ejecuta, no invalida el caché del servidor ni afecta a otros usuarios o peticiones.

</details>



## Pregunta 6

Un miembro del equipo escribe la siguiente Server Action:

```js
'use server';

import { revalidateTag } from 'next/cache';

export async function refreshStayRooms(stayId) {
  revalidateTag(`stay-${stayId}-rooms`);
  return { success: true };
}
```

En el Header, un botón la invoca así:

```jsx
<button onClick={() => refreshStayRooms(7)}>
  Actualizar habitaciones
</button>
```

¿Qué ocurre cuando el usuario pulsa el botón?

A) El tag `stay-7-rooms` se invalida y todos los fetches que lo usen servirán datos frescos en la siguiente petición.

B) Nada. Las Server Actions solo pueden invocarse desde formularios con `action`, no desde `onClick`.

C) Error en tiempo de ejecución. `revalidateTag` no puede recibir strings dinámicos, solo tags literales definidos en compile time.

D) El caché se invalida pero solo para el usuario que ha pulsado el botón, no para los demás usuarios.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: A**

**¿Por qué es correcta?**  
Las Server Actions pueden invocarse desde cualquier evento del cliente, incluido `onClick`. `revalidateTag` acepta strings dinámicos y la invalidación del caché afecta a todos los usuarios (es global en el servidor).

**¿Por qué las demás no lo son?**
- **B)** Las Server Actions no están limitadas a formularios. Se pueden llamar desde cualquier evento del cliente (`onClick`, `onSubmit`, etc.).
- **C)** `revalidateTag` acepta completamente strings dinámicos y variables. No hay restricción de compile time.
- **D)** El caché de Next.js es global en el servidor. Invalidar un tag afecta a todas las peticiones futuras, independientemente del usuario.

</details>



## Pregunta 7

El equipo implementa lo siguiente en `stay/[id]/page.js`:

```js
import { getStaysFromStore } from '@/lib/api-server';

export async function generateStaticParams() {
  const stays = await getStaysFromStore();
  return stays.map((s) => ({ id: String(s.id) }));
}

export default async function StayPage({ params }) {
  const { id } = await params;
  // ...
}
```

¿Por qué se usa `getStaysFromStore` (de `api-server.js`) en lugar de hacer `fetch` a `/api/v1/stays`?

A) Porque `getStaysFromStore` es más rápida ya que no pasa por HTTP.

B) Porque durante el build (`npm run build`) no hay servidor HTTP corriendo, por lo que las URLs relativas como `/api/v1/stays` no funcionan. `api-server.js` accede directamente a la base de datos importando las funciones de `_store.js`.

C) Porque `generateStaticParams` se ejecuta en el navegador y no puede hacer peticiones al servidor.

D) Porque los Route Handlers no aceptan peticiones GET durante el build, solo en runtime.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: B**

**¿Por qué es correcta?**  
`generateStaticParams` se ejecuta durante el build, cuando no hay un servidor HTTP activo. Las URLs relativas no pueden resolverse porque no hay servidor escuchando. `api-server.js` accede directamente a la BD sin HTTP, superando esta limitación.

**¿Por qué las demás no lo son?**
- **A)** Aunque es cierto que evita HTTP, la razón fundamental no es el rendimiento sino la imposibilidad de hacer `fetch` a URLs relativas durante el build.
- **C)** `generateStaticParams` se ejecuta en Node.js durante el build, no en el navegador.
- **D)** Los Route Handlers sí aceptan peticiones GET durante el build si se les llama directamente, pero el problema es que no hay servidor corriendo para responder a URLs relativas.

</details>



## Pregunta 8

El archivo `stays/[destination]/loading.js` contiene un skeleton de carga:

```jsx
export default function Loading() {
  return (
    <div className="space-y-4 p-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-56 bg-stay-dark-elevated rounded-xl animate-pulse" />
      ))}
    </div>
  );
}
```

¿En qué momento muestra Next.js este componente?

A) Cuando la página ha terminado de cargar pero aún no se ha montado en el DOM, como transición visual.

B) Solo cuando el desarrollador lo importa manualmente y lo renderiza con un condicional `isLoading`.

C) Automáticamente mientras el `page.js` de esa ruta está resolviendo sus promesas asíncronas (`fetch` de datos). Next.js envuelve la página en un `Suspense` boundary y muestra el `loading.js` como fallback.

D) Solo la primera vez que se accede a la ruta. En visitas posteriores Next.js usa la versión cacheada y nunca muestra el skeleton.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: C**

**¿Por qué es correcta?**  
`loading.js` es una convención de Next.js que crea automáticamente un `Suspense` boundary para la ruta. Mientras la página está obteniendo datos asíncronos, Next.js renderiza el componente `loading.js` como fallback, sin que el desarrollador tenga que gestionar estados de carga manualmente.

**¿Por qué las demás no lo son?**
- **A)** El skeleton se muestra *durante* la carga, no después de que la página haya terminado de cargar.
- **B)** No es necesario importar `loading.js` manualmente. Next.js lo detecta automáticamente por convención de nombre y ubicación en el árbol de rutas.
- **D)** El skeleton se muestra siempre que la ruta esté resolviendo datos asíncronos, no solo en la primera visita. Incluso en visitas posteriores, si hay una revalidación o carga de datos, puede aparecer.

</details>



## Pregunta 9

El equipo implementa el Route Handler para el endpoint `POST /api/v1/bookings`:

```js
import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { createBookingWithItems } from '../_store';

export async function POST(request) {
  const session = await auth0.getSession(request);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = await request.json();
  const booking = await createBookingWithItems({
    userId: session.user.sub,
    stayId: body.stayId,
    items: body.items,
    checkIn: body.checkIn,
    checkOut: body.checkOut,
  });

  return NextResponse.json({ data: booking }, { status: 201 });
}
```

Si falla la inserción de uno de los items de la reserva, ¿qué ocurre?

A) La reserva se crea parcialmente con los items que sí se insertaron correctamente. Los que fallaron quedan pendientes.

B) El endpoint devuelve 201 con una reserva vacía porque Next.js ignora las excepciones de las transacciones.

C) La transacción ejecuta `ROLLBACK` automáticamente, deshaciendo la creación de la reserva y todos los items. La excepción se propaga y el endpoint devuelve un error 500.

D) `withTransaction` no ejecuta rollback automáticamente; el desarrollador debe hacer rollback manual en un bloque `catch`.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: C**

**¿Por qué es correcta?**  
Según el enunciado, `withTransaction` realiza rollback automático en caso de error. Si falla la inserción de un item, toda la transacción se deshace (la reserva y todos los items), garantizando la integridad de los datos. La excepción se propaga fuera del Route Handler, y como no se captura, Next.js devuelve un error 500.

**¿Por qué las demás no lo son?**
- **A)** Una transacción atómica garantiza que todas las operaciones se completen o ninguna. No permite estados parciales.
- **B)** Next.js no ignora las excepciones de transacciones. Si hay un error no capturado en un Route Handler, devuelve un error 500.
- **D)** El enunciado indica explícitamente que `withTransaction` incluye "rollback automático en caso de error". El desarrollador no necesita gestionarlo manualmente.

</details>



## Pregunta 10

Un desarrollador intenta ejecutar una consulta a PostgreSQL desde el proxy:

```js
// src/proxy.js
import { query } from './app/api/v1/_db';

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/v1/bookings')) {
    const result = await query('SELECT role FROM users WHERE email = $1', [email]);
    if (result.rows[0]?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  return NextResponse.next();
}
```

¿Por qué este código no funciona?

A) Porque el proxy no puede importar archivos que estén dentro de `app/api`.

B) Porque `query()` no acepta parámetros (`$1`); solo acepta queries sin parámetros.

C) Porque el proxy se ejecuta en Edge Runtime, que no soporta las APIs nativas de Node.js (`net`, `tls`) necesarias para el paquete `pg`. Las conexiones a PostgreSQL solo pueden hacerse desde Route Handlers o Server Components que usan Node.js Runtime.

D) Porque el proxy solo se ejecuta para rutas de páginas, nunca para rutas `/api`.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: C**

**¿Por qué es correcta?**  
El proxy de Next.js se ejecuta en Edge Runtime, un entorno ligero que no incluye APIs nativas de Node.js como `net` o `tls`. El paquete `pg` necesita estas APIs para conectar con PostgreSQL, por lo que no funciona en el proxy. Las conexiones a BD deben hacerse desde Route Handlers o Server Components, que usan Node.js Runtime.

**¿Por qué las demás no lo son?**
- **A)** El proxy sí puede importar archivos de `app/api` si son módulos JavaScript válidos. La restricción no es de importación sino de runtime.
- **B)** `query()` del paquete `pg` soporta completamente parámetros posicionales (`$1`, `$2`, etc.) para prevenir inyección SQL.
- **D)** El proxy intercepta todas las rutas, incluidas las de `/api`. La limitación no es de scope sino de capacidades del runtime.

</details>


## Pregunta 11

El equipo tiene la siguiente estructura de ficheros para manejar errores 404:

```
src/app/
  not-found.js
  [lang]/
    (main)/
      not-found.js
      stay/[id]/page.js
```

Dentro de `stay/[id]/page.js`, cuando el alojamiento no existe, se llama a `notFound()`:

```js
import { notFound } from 'next/navigation';

export default async function StayPage({ params }) {
  const { id } = await params;
  const stay = await getStayDetails(id);

  if (!stay) {
    notFound();
  }
  // ...
}
```

¿Qué página 404 se muestra al usuario?

A) Siempre se muestra `app/not-found.js` (el global), independientemente de dónde se llame a `notFound()`.

B) Se muestra `app/[lang]/(main)/not-found.js` porque es el `not-found` más cercano en la jerarquía de rutas, y al estar dentro del Route Group `(main)`, se renderiza con el layout que incluye Header y Footer.

C) Se muestra una página 404 por defecto de Next.js porque `notFound()` no busca archivos `not-found.js` personalizados.

D) Se produce un error de compilación porque `notFound()` solo puede llamarse desde Client Components.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: B**

**¿Por qué es correcta?**  
Next.js busca el `not-found.js` más cercano en la jerarquía de rutas desde donde se invoca `notFound()`. Como `stay/[id]/page.js` está dentro de `(main)`, se usa `app/[lang]/(main)/not-found.js`, que hereda el layout con Header y Footer del Route Group.

**¿Por qué las demás no lo son?**
- **A)** El `not-found.js` global solo se usa cuando no hay ninguno más específico en la jerarquía de la ruta.
- **C)** `notFound()` sí busca y renderiza archivos `not-found.js` personalizados si existen en la jerarquía.
- **D)** `notFound()` puede llamarse tanto desde Server Components como desde Client Components. Es una API universal de `next/navigation`.

</details>


## Pregunta 12

El equipo quiere que el Footer muestre la fecha y hora actual formateada. Un desarrollador escribe:

```jsx
export default function Footer() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer>
      <p>UnirStay {currentTime.toLocaleTimeString()}</p>
    </footer>
  );
}
```

Este componente da error. Si el equipo quiere mantener el reloj en tiempo real, ¿qué debe hacer?

A) Añadir `'use client'` al inicio del archivo, ya que `useState` y `useEffect` son hooks de React que solo funcionan en Client Components.

B) Sustituir `useState` por `useRef` porque `useRef` sí funciona en Server Components.

C) Mover el `setInterval` a una Server Action para que se ejecute en el servidor y envíe actualizaciones al cliente.

D) Usar `Date.now()` en vez de `new Date()` porque los Server Components solo soportan timestamps numéricos.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: A**

**¿Por qué es correcta?**  
`useState` y `useEffect` son hooks exclusivos de Client Components. Por defecto, todos los componentes en App Router son Server Components, por lo que es obligatorio añadir `'use client'` para usar hooks de estado y efectos.

**¿Por qué las demás no lo son?**
- **B)** `useRef` también es un hook de React y requiere `'use client'`. No funciona en Server Components.
- **C)** Las Server Actions no pueden mantener conexiones persistentes como `setInterval` ni enviar actualizaciones progresivas al cliente de esa forma.
- **D)** Los Server Components pueden usar `new Date()` sin problemas. La restricción no es el tipo de dato sino el uso de hooks.

</details>


## Pregunta 13

El equipo configura las fuentes de la aplicación en el root layout:

```jsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={inter.variable}>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
```

¿Cuál es el beneficio principal de usar `next/font/google` frente a incluir la fuente con un `<link>` de Google Fonts en el `<head>`?

A) `next/font/google` descarga la fuente dinámicamente en cada petición del usuario desde los servidores de Google, garantizando que siempre se disponga de la última versión.

B) No hay diferencia real. Ambas formas cargan la fuente exactamente igual.

C) `next/font/google` optimiza la fuente automáticamente: la descarga en build time, la hospeda localmente (self-hosting) eliminando peticiones a Google, y evita el Flash of Unstyled Text (FOUT).

D) `next/font/google` convierte las fuentes a formato SVG para compatibilidad con todos los navegadores.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: C**

**¿Por qué es correcta?**  
`next/font/google` descarga las fuentes durante el build, las aloja localmente en el proyecto (self-hosting) y aplica optimizaciones automáticas como `display: 'swap'` para evitar el FOUT. Elimina la dependencia de peticiones externas a Google en runtime.

**¿Por qué las demás no lo son?**
- **A)** Es lo contrario: la fuente se descarga una sola vez en build time, no en cada petición del usuario.
- **B)** Hay diferencias significativas: self-hosting, optimización automática y eliminación de peticiones externas.
- **D)** Next.js no convierte fuentes a SVG. Las sirve en los formatos optimizados originales (woff2, etc.).

</details>


## Pregunta 14

Un desarrollador usa `clsx` para gestionar los estilos de las tarjetas de habitaciones según su disponibilidad:

```js
import clsx from 'clsx';

const getRoomCardClasses = (room) => {
  return clsx(
    'p-4 rounded-xl border-2 transition-all duration-300',
    {
      'border-stay-teal bg-stay-teal/10 cursor-pointer hover:scale-105': room.available,
      'border-gray-500 bg-gray-800/50 opacity-50 cursor-not-allowed': !room.available,
    }
  );
};
```

¿Qué hace `clsx` cuando `room.available` es `false`?

A) Incluye todas las clases de ambas condiciones, ya que `clsx` siempre concatena todo.

B) Lanza un error porque `clsx` no acepta objetos como argumento, solo strings.

C) Incluye las clases base (`'p-4 rounded-xl ...'`) junto con las clases del bloque cuya clave evalúa a `true`. Si `room.available` es `false`, incluye `'border-gray-500 bg-gray-800/50 opacity-50 cursor-not-allowed'` y no incluye las clases de `available`.

D) Incluye las clases base (`'p-4 rounded-xl ...'`) junto con `'border-stay-teal bg-stay-teal/10 cursor-pointer hover:scale-105'`, ya que `clsx` invierte la lógica de los objetos.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: C**

**¿Por qué es correcta?**  
`clsx` procesa cada argumento: los strings se incluyen directamente, y en los objetos solo incluye las claves cuyo valor evalúa a `true`. Con `room.available = false`, se incluyen las clases base más las del bloque `!room.available`.

**¿Por qué las demás no lo son?**
- **A)** `clsx` no concatena todas las clases de un objeto. Evalúa cada clave y solo incluye las que son truthy.
- **B)** `clsx` acepta múltiples tipos de argumentos: strings, arrays, objetos y valores null/undefined. Los objetos son uno de sus usos principales.
- **D)** `clsx` no invierte la lógica. Cuando la clave evalúa a `false`, sus clases se excluyen, no se incluyen.

</details>


## Pregunta 15

El equipo observa que la función `getStayRooms()` tarda 180ms la primera vez y 2ms en las siguientes peticiones dentro de 45 segundos. Pasados 50 segundos, la petición tarda 2ms pero los datos aún son los antiguos. En la siguiente petición los datos ya están actualizados y tardan 3ms.

La función está implementada así:

```js
const response = await fetch(`${API_BASE_URL}/api/v1/stays/${id}/rooms`, {
  next: { revalidate: 45 }
});
```

¿Qué patrón de caché describe este comportamiento?

A) Stale-While-Revalidate (SWR). Pasados 45 segundos el caché está stale: se sirve la versión cacheada al usuario (rápido), pero se lanza una revalidación en background. La siguiente petición ya tiene los datos frescos.

B) Cache-First con TTL estricto. A los 45 segundos el caché expira completamente y se elimina. La siguiente petición siempre tarda 180ms porque tiene que ir directamente a la API.

C) Write-Through. Cada escritura actualiza el caché automáticamente y las lecturas siempre obtienen datos frescos.

D) No-Cache con memoización. Los datos nunca se cachean, pero Next.js los memoiza durante el render actual.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: A**

**¿Por qué es correcta?**  
El patrón SWR (Stale-While-Revalidate) describe exactamente este comportamiento: tras expirar el TTL (45s), la petición sirve datos stale desde caché (rápido) mientras se revalida en background. La siguiente petición ya usa los datos frescos.

**¿Por qué las demás no lo son?**
- **B)** En un TTL estricto, tras expirar el caché la petición tendría que esperar a obtener datos frescos (180ms), no serviría datos stale rápidos.
- **C)** Write-Through implica que cada escritura actualiza simultáneamente el caché y la BD, lo cual no está ocurriendo aquí.
- **D)** Los datos claramente se cachean (la primera petición tarda 180ms, las siguientes 2ms). No es "no-cache".

</details>


## Pregunta 16

El equipo intenta optimizar la página de detalle de alojamiento obteniendo datos en paralelo:

```js
export default async function StayPage({ params }) {
  const { id } = await params;

  const [stay, rooms] = await Promise.all([
    getStayDetails(id),
    getStayRooms(id),
  ]);

  // ...
}
```

Si `getStayDetails(id)` se llama dos veces con el mismo `id` dentro de un `Promise.all`, ¿cuántas peticiones HTTP reales se realizan?

A) Una sola, porque la memoización automática de Next.js detecta que ambas llamadas son idénticas.

B) Dos peticiones reales. La memoización automática de Next.js no funciona con `Promise.all` porque las llamadas se ejecutan en paralelo y la segunda se inicia antes de que la primera complete, sin oportunidad de reutilizar el resultado.

C) Cero, porque `Promise.all` siempre lee del caché de datos.

D) Depende del valor de `revalidate`: si es mayor a 0 se hace una sola petición, si es 0 se hacen dos.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: B**

**¿Por qué es correcta?**  
La memoización automática de Next.js deduplica fetches idénticos *dentro del mismo render*, pero `Promise.all` inicia ambas promesas simultáneamente. La segunda llamada comienza antes de que la primera haya completado y almacenado su resultado en la caché de deduplicación, por lo que ambas realizan peticiones HTTP reales.

**¿Por qué las demás no lo son?**
- **A)** La deduplicación automática solo funciona cuando el segundo `fetch` ocurre *después* de que el primero haya completado. En `Promise.all`, ambos inician al mismo tiempo.
- **C)** `Promise.all` no lee del caché automáticamente. Las funciones ejecutan sus `fetch` de forma independiente.
- **D)** El valor de `revalidate` controla la vida útil del caché, no la deduplicación de peticiones simultáneas dentro de un mismo render.

</details>


## Pregunta 17

La landing page de UnirStay tiene la siguiente configuración:

```js
// [lang]/(main)/page.js

export const revalidate = 60;

export default async function HomePage() {
  const stats = await getStats();
  const featuredStays = await getFeaturedStays();

  return (
    <div>
      <StatsSection data={stats} />
      <FeaturedStaysSection stays={featuredStays} />
    </div>
  );
}
```

¿Qué tipo de renderizado aplica Next.js a esta página?

A) SSR puro. La página se renderiza completamente en cada petición sin ninguna optimización.

B) CSR. El `export const revalidate` convierte la página en un Client Component que se refresca cada 60 segundos.

C) ISR (Incremental Static Regeneration). La página se genera como HTML estático en el build y se regenera completamente cada 60 segundos. La primera visita tras expirar sirve la versión stale y dispara una regeneración en background.

D) SSG puro. `export const revalidate` no tiene efecto sobre la generación estática.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: C**

**¿Por qué es correcta?**  
`export const revalidate = 60` en un Server Component que no usa `dynamic = 'force-dynamic'` configura ISR. Next.js genera un HTML estático en build y lo regenera automáticamente cada 60 segundos, sirviendo la versión stale mientras se revalida en background.

**¿Por qué las demás no lo son?**
- **A)** SSR puro requeriría `export const dynamic = 'force-dynamic'`, que fuerza el renderizado en cada petición. `revalidate` indica caché, no SSR.
- **B)** `revalidate` no convierte un Server Component en Client Component. Es una directiva de caché de página, no de comportamiento del cliente.
- **D)** En SSG puro, la página nunca se regeneraría después del build. `revalidate` es precisamente lo que habilita la regeneración incremental (ISR).

</details>


## Pregunta 18

El equipo tiene los siguientes componentes en la página de alojamientos por destino:

```jsx
// stays/[destination]/page.js (Server Component)
export default async function StaysPage({ params }) {
  const { destination } = await params;
  const stays = await getStaysWithDetails(destination);
  return (
    <div>
      <DestinationSyncClient destination={destination} />
      <StayList stays={stays} destination={destination} />
    </div>
  );
}
```

```jsx
// DestinationSyncClient.jsx
'use client';
import { useEffect } from 'react';
import { useGlobalContext } from '@/context/GlobalContext';

export default function DestinationSyncClient({ destination }) {
  const { setDestination } = useGlobalContext();
  useEffect(() => { setDestination(destination); }, [destination, setDestination]);
  return null;
}
```

¿Por qué `DestinationSyncClient` es un Client Component y `StaysPage` es un Server Component?

A) No hay razón técnica. Ambos podrían ser Server Components si se mueve `setDestination` al servidor.

B) `DestinationSyncClient` necesita `useEffect` y `useContext` (hooks de React) para sincronizar el estado del contexto global, lo que solo es posible en Client Components. `StaysPage` solo carga datos con `fetch` y no necesita hooks ni interactividad, por lo que se beneficia de ser Server Component con caché activo.

C) `StaysPage` es Server Component solo porque hace `fetch`. Si no hiciera `fetch`, también sería Client Component.

D) Es una convención del equipo. Todos los archivos `.jsx` son Client Components y los `.js` son Server Components.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: B**

**¿Por qué es correcta?**  
`DestinationSyncClient` usa `useEffect` y `useContext`, hooks exclusivos de Client Components, para sincronizar estado global. `StaysPage` solo obtiene datos de forma asíncrona y no requiere interactividad, por lo que permanece como Server Component y se beneficia de caché, menor bundle y seguridad.

**¿Por qué las demás no lo son?**
- **A)** El contexto global de React (`useContext`) solo existe en el cliente. No puede moverse al servidor porque Server Components no tienen acceso al árbol de contexto del cliente.
- **C)** Un componente sin `fetch` sigue siendo Server Component por defecto en App Router. El `fetch` no determina el tipo de componente; los hooks sí.
- **D)** La extensión del archivo no determina el tipo de componente en Next.js App Router. Todos los archivos son Server Components por defecto salvo que incluyan `'use client'`.

</details>


## Pregunta 19

El equipo implementa el endpoint `GET /api/v1/stays` con soporte para query params:

```js
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const destination = searchParams.get('destination');
  const rating = searchParams.get('rating');

  let stays = await listStays();

  if (destination) {
    stays = stays.filter(
      (s) => s.destination.toLowerCase() === destination.toLowerCase()
    );
  }

  if (rating === 'top') {
    stays = stays.sort((a, b) => b.rating_value - a.rating_value);
  }

  return NextResponse.json(stays);
}
```

Si se hace una petición a `/api/v1/stays?destination=Paris&rating=top`, ¿qué devuelve el endpoint?

A) Solo los alojamientos de París, sin ordenar, porque los query params son mutuamente excluyentes.

B) Los alojamientos de París, ordenados por rating de menor a mayor. Ambos filtros se aplican secuencialmente: primero filtra por destino y luego ordena el resultado ascendentemente con `a.rating_value - b.rating_value`.

C) Los alojamientos de París, ordenados por rating de mayor a menor. Ambos filtros se aplican secuencialmente: primero filtra por destino y luego ordena el resultado.

D) Un error 400 porque no se pueden combinar dos query params en un mismo endpoint.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: C**

**¿Por qué es correcta?**  
Los filtros se aplican secuencialmente: primero `destination` filtra el array, y luego `rating === 'top'` ordena el resultado filtrado con `b.rating_value - a.rating_value`, que es orden descendente (mayor a menor).

**¿Por qué las demás no lo son?**
- **A)** Los query params no son mutuamente excluyentes. Ambas condiciones (`if`) se evalúan de forma independiente y se aplican ambas si se cumplen.
- **B)** El orden es `b.rating_value - a.rating_value`, que es descendente (mayor a menor), no ascendente. `a - b` sería ascendente.
- **D)** Next.js Route Handlers no imponen ninguna restricción sobre la cantidad de query params. El desarrollador decide cómo procesarlos.

</details>


## Pregunta 20

El equipo discute por qué el pool de conexiones de PostgreSQL se crea como singleton:

```js
// _db.js
import { Pool } from 'pg';

let pool;

if (!global._pgPool) {
  global._pgPool = new Pool({ connectionString: process.env.DATABASE_URL });
}
pool = global._pgPool;

export async function query(text, params) {
  return pool.query(text, params);
}
```

¿Por qué se usa `global._pgPool` en lugar de simplemente crear `new Pool()` directamente?

A) Porque el constructor `Pool()` de la librería `pg` incluye un mecanismo interno de detección de instancias duplicadas. Si se intenta crear un segundo `Pool` con el mismo `connectionString`, la librería lanza un error.

B) Por rendimiento: acceder a `global` es más rápido que crear una variable local.

C) En desarrollo, el hot reload de Next.js recarga los módulos frecuentemente, lo que crearía un nuevo `Pool` en cada recarga. Guardar el pool en `global` evita acumular múltiples conexiones abiertas a PostgreSQL, ya que `global` persiste entre recargas de módulos.

D) Es obligatorio en Next.js 16. Sin `global`, los Route Handlers no pueden acceder al pool.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: C**

**¿Por qué es correcta?**  
En desarrollo, Next.js recarga los módulos en cada cambio de código (hot reload). Cada recarga ejecutaría `new Pool()`, creando conexiones adicionales a PostgreSQL. Almacenar el pool en `global` lo mantiene vivo entre recargas, evitando fugas de conexiones.

**¿Por qué las demás no lo son?**
- **A)** El paquete `pg` no tiene detección de instancias duplicadas. Permite crear múltiples pools sin error.
- **B)** El rendimiento de acceso a `global` no es la razón. El problema es la gestión del ciclo de vida del pool entre recargas.
- **D)** No es obligatorio en Next.js 16. Es un patrón recomendado para desarrollo, no un requisito del framework.

</details>



## Pregunta 21

El equipo observa que la ruta `/es/stay/42/room/7` carga correctamente la página de la habitación 7 del alojamiento 42. El archivo está en:

```
src/app/[lang]/(main)/stay/[id]/room/[roomId]/page.js
```

Y el componente accede a los parámetros así:

```js
export default async function RoomPage({ params }) {
  const { lang, id, roomId } = await params;
  // ...
}
```

¿Qué valores tienen `lang`, `id` y `roomId` para la URL `/es/stay/42/room/7`?

A) `lang = "es"`, `id = "42"`, `roomId = "7"`. Los tres segmentos dinámicos se capturan correctamente y el Route Group `(main)` no genera ningún parámetro adicional.

B) `lang = "es"`, `id = "stay"`, `roomId = "room"`. Los segmentos dinámicos capturan los nombres de las carpetas, no los valores de la URL.

C) Solo `roomId = "7"` está disponible. Los parámetros de segmentos padre (`lang`, `id`) no se propagan a las páginas hijas.

D) `lang = "es"`, `id = "42"`, `roomId = undefined`. Los segmentos dinámicos anidados a más de dos niveles no son soportados por Next.js.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: A**

**¿Por qué es correcta?**  
Next.js propaga todos los segmentos dinámicos (`[lang]`, `[id]`, `[roomId]`) a través de la jerarquía de rutas. El Route Group `(main)` no genera parámetros. Los valores capturados son los fragmentos correspondientes de la URL.

**¿Por qué las demás no lo son?**
- **B)** Los segmentos dinámicos capturan los valores de la URL, no los nombres de las carpetas estáticas que los rodean.
- **C)** Next.js propaga todos los parámetros dinámicos de la ruta completa, no solo los del último segmento. `params` contiene `lang`, `id` y `roomId`.
- **D)** Next.js soporta segmentos dinámicos anidados sin límite práctico de profundidad. `roomId` captura `"7"` correctamente.

</details>


## Pregunta 22

Un desarrollador intenta cargar los alojamientos directamente desde la base de datos en un Client Component:

```jsx
'use client';
import { getStaysFromStore } from '@/lib/api-server';

export default function StaySearch() {
  const [stays, setStays] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getStaysFromStore();
      setStays(data);
    }
    load();
  }, []);

  return <div>{stays.map(s => <p key={s.id}>{s.name}</p>)}</div>;
}
```

Este componente produce un error. ¿Cuál es la causa?

A) `useState` no puede almacenar arrays de objetos directamente. React necesita que el estado inicial sea un valor primitivo (`string`, `number`, `boolean`) o `null`. Para almacenar colecciones de datos, se debe usar `useReducer` con un dispatch que gestione las operaciones sobre el array.

B) `api-server.js` importa `_store.js` que usa el paquete `pg` para conectar a PostgreSQL. `pg` usa APIs nativas de Node.js que no están disponibles en el navegador. Los Client Components no pueden acceder a la base de datos directamente; deben hacer `fetch` a los Route Handlers.

C) `useEffect` no soporta funciones asíncronas definidas dentro de su callback. Al declarar `async function load()` internamente y ejecutarla, React ignora la promesa devuelta, lo que provoca un error de tipo `"Effect callbacks are synchronous to prevent race conditions"` que interrumpe el renderizado.

D) `getStaysFromStore` es una función síncrona que devuelve directamente los datos sin una promesa. Al usar `await` con una función que no retorna una `Promise`, JavaScript lanza un `TypeError: cannot await non-thenable value` que impide que los datos se asignen al estado.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: B**

**¿Por qué es correcta?**  
`api-server.js` importa directamente `_store.js` que usa el paquete `pg` (PostgreSQL). `pg` requiere APIs de Node.js (`net`, `tls`) que no existen en el navegador. Los Client Components deben comunicarse con la BD a través de Route Handlers (`fetch`), nunca directamente.

**¿Por qué las demás no lo son?**
- **A)** `useState` acepta cualquier tipo de valor inicial, incluidos arrays y objetos. No requiere `useReducer`.
- **C)** `useEffect` sí permite funciones asíncronas internas; es un patrón muy común (IIFE async). El callback de `useEffect` en sí debe ser síncrono, pero puede invocar una función async internamente.
- **D)** `getStaysFromStore` es una función async que devuelve una promesa con los datos de la BD. No es síncrona.

</details>


## Pregunta 23

El equipo quiere mantener CSS Modules solo para un efecto de brillo animado en los botones de reserva:

```jsx
import clsx from 'clsx';
import styles from './ReserveButton.module.css';

<button className={clsx(
  styles.shineEffect,
  'px-6 py-3 bg-gradient-to-r from-stay-teal to-stay-teal-dark',
  'text-white rounded-xl font-bold',
  'hover:-translate-y-0.5 transition-all duration-300'
)}>
  Reservar ahora
</button>
```

¿Por qué se usa CSS Modules para el efecto shine en lugar de hacerlo todo con Tailwind?

A) Porque Tailwind no soporta pseudo-elementos como `::before` ni `::after` en ningún caso.

B) Porque TailwindCSS no puede manejar fácilmente pseudo-elementos (`::before`) con animaciones complejas que requieren `content`, `position absolute` y gradientes animados. CSS Modules complementa a Tailwind para estos casos.

C) Porque CSS Modules es siempre más eficiente que Tailwind para cualquier tipo de animación.

D) Porque `clsx` requiere obligatoriamente al menos un CSS Module como primer argumento para funcionar.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: B**

**¿Por qué es correcta?**  
Tailwind está diseñado para estilos utilitarios rápidos, pero pseudo-elementos con animaciones complejas (keyframes personalizados, `content`, posicionamiento absoluto relativo) son más expresivos y mantenibles en CSS Modules. Ambos sistemas coexisten sin problema.

**¿Por qué las demás no lo son?**
- **A)** Tailwind sí soporta pseudo-elementos básicos (ej: `after:`, `before:`), pero animaciones complejas con keyframes personalizados y múltiples propiedades son engorrosas de escribir y mantener puramente con utilidades.
- **C)** La eficiencia no es la razón principal. CSS Modules no es inherentemente más eficiente; la ventaja es la expresividad para casos complejos.
- **D)** `clsx` no tiene ninguna dependencia de CSS Modules. Funciona únicamente con strings, arrays y objetos de clases.

</details>


## Pregunta 24

Un desarrollador escribe una Server Action sin la directiva `'use server'`:

```js
// lib/actions.js

import { revalidatePath } from 'next/cache';

export async function invalidateAllCache() {
  revalidatePath('/', 'layout');
  return { success: true };
}
```

Y la llama desde un Client Component:

```jsx
'use client';
import { invalidateAllCache } from '@/lib/actions';

<button onClick={() => invalidateAllCache()}>Limpiar caché</button>
```

¿Qué ocurre al pulsar el botón?

A) Funciona correctamente. La directiva `'use server'` solo es necesaria si el archivo contiene más de una función exportada.

B) Se produce un error. Sin la directiva `'use server'` al inicio del archivo (o de la función), Next.js no puede identificar `invalidateAllCache` como una Server Action. Intentará incluirla en el bundle del cliente, donde `revalidatePath` no está disponible.

C) Se produce un error de tipo `TypeError: revalidatePath is not a function` porque `revalidatePath` solo se puede importar dentro de archivos que tengan la extensión `.server.js`. Al estar en un archivo `.js` estándar, Next.js no reconoce el contexto del servidor y la importación devuelve `undefined`.

D) Funciona, pero con un warning en consola indicando que falta `'use server'`. El caché se invalida correctamente en desarrollo; sin embargo, en producción el comportamiento es impredecible porque Next.js optimiza los bundles de forma diferente.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: B**

**¿Por qué es correcta?**  
`'use server'` es la directiva que marca una función o archivo completo como Server Action, permitiendo que Next.js lo ejecute en el servidor. Sin ella, Next.js intenta incluir la función en el bundle del cliente, donde `next/cache` (incluido `revalidatePath`) no está disponible.

**¿Por qué las demás no lo son?**
- **A)** `'use server'` es obligatoria para cualquier Server Action, independientemente de cuántas funciones haya en el archivo.
- **C)** `revalidatePath` está disponible en archivos `.js` normales. La restricción es que debe ejecutarse en el servidor, no que requiera una extensión especial.
- **D)** No funciona en desarrollo sin `'use server'`. Next.js detecta el intento de ejecutar código de servidor en el cliente y lanza un error claro.

</details>


## Pregunta 25

El equipo necesita generar estáticamente las páginas de detalle de alojamiento:

```js
export async function generateStaticParams() {
  const response = await fetch('http://localhost:3000/api/v1/stays');
  const stays = await response.json();
  return stays.map((s) => ({ id: String(s.id) }));
}
```

Este código falla en el build. ¿Cuál es la solución correcta?

A) Añadir un timeout de varios segundos al `fetch` junto with un bloque `try/catch` que reintente la petición hasta 3 veces, dando tiempo suficiente al servidor de desarrollo para arrancar durante el proceso de build. Así `generateStaticParams` puede esperar a que `localhost:3000` esté disponible.

B) Configurar la variable de entorno `API_URL` con la URL del servidor de producción para que durante el build, `generateStaticParams` haga las peticiones HTTP a un servidor externo real que esté corriendo. De esta forma, aunque `localhost:3000` no esté disponible, el `fetch` puede alcanzar la API de producción y obtener la lista de alojamientos.

C) Usar la función de acceso directo a base de datos de `api-server.js` (`getStaysFromStore`) que importa `_store.js` sin pasar por HTTP, ya que durante el build no hay servidor corriendo para responder a peticiones `fetch`.

D) Mover `generateStaticParams` a un Client Component y envolver la lógica en un `useEffect` que haga el `fetch` durante la hidratación en el navegador, ya que los Client Components tienen acceso completo a la API `fetch` del navegador sin las restricciones del entorno de build de Next.js.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: C**

**¿Por qué es correcta?**  
`generateStaticParams` se ejecuta durante el build, cuando no hay un servidor HTTP activo en `localhost:3000`. Las URLs relativas no pueden resolverse porque no hay servidor escuchando. `api-server.js` accede directamente a la BD sin HTTP, superando esta limitación.

**¿Por qué las demás no lo son?**
- **A)** El servidor de desarrollo no arranca automáticamente durante el build de `generateStaticParams`. Añadir retries no soluciona la ausencia de servidor.
- **B)** Depender de un servidor de producción externo durante el build introduce fragilidad (disponibilidad de red, datos potencialmente desactualizados) y no es una práctica recomendada.
- **D)** `generateStaticParams` solo puede usarse en Server Components (o archivos de ruta), nunca en Client Components. Su propósito es generar páginas en build time, no en el navegador.

</details>


## Pregunta 26

El equipo compara el renderizado de dos páginas de la aplicación:

Página A: `about/page.js` (no tiene `fetch` de datos ni `export const revalidate`)
Página B: `stays/[destination]/page.js` (hace `fetch` con `revalidate: 60` en el Server Component)

Después de ejecutar `npm run build`, ¿qué estrategia de renderizado usa cada página?

A) Ambas son SSR porque todas las páginas en App Router son dinámicas.

B) La Página A es SSG (se genera como HTML estático en build time, sin datos dinámicos). La Página B es SSR con caché de datos (se renderiza en el servidor en cada request, pero los fetches internos se cachean 60 segundos).

C) La Página A es ISR con revalidate infinito y la Página B es ISR con revalidate de 60 segundos.

D) Ambas son SSG porque Next.js siempre genera páginas estáticas salvo que se use `export const dynamic = 'force-dynamic'`.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: B**

**¿Por qué es correcta?**  
Página A no tiene datos dinámicos ni revalidate, por lo que Next.js la genera como HTML estático puro (SSG) en build time. Página B hace `fetch` con `revalidate: 60`, lo que configura caché de datos pero no ISR de página; la página se renderiza en el servidor en cada request y los datos se cachean 60 segundos.

**¿Por qué las demás no lo son?**
- **A)** No todas las páginas en App Router son dinámicas. Next.js genera estáticamente las páginas que no requieren datos dinámicos por defecto.
- **C)** ISR de página requiere `export const revalidate` a nivel de página, no solo en los `fetch` internos. `fetch` con `revalidate` es caché de datos, no ISR de página.
- **D)** Next.js genera estáticamente por defecto, pero las páginas con datos dinámicos y sin `generateStaticParams` se renderizan en el servidor (SSR), no como SSG.

</details>


## Pregunta 27

El equipo implementa el Route Handler para cancelar una reserva:

```js
// api/v1/bookings/[bookingId]/route.js

import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { cancelBooking, getBookingById } from '../../_store';

export async function DELETE(request, { params }) {
  const session = await auth0.getSession(request);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { bookingId } = await params;
  const booking = await getBookingById(bookingId);

  if (!booking) {
    return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
  }

  if (booking.status !== 'pending') {
    return NextResponse.json({ error: 'Solo se pueden cancelar reservas pendientes' }, { status: 400 });
  }

  await cancelBooking(bookingId);
  return new NextResponse(null, { status: 204 });
}
```

¿Qué código de estado HTTP devuelve el endpoint cuando la cancelación es exitosa y por qué?

A) 200 con un JSON `{ success: true, cancelledBookingId: bookingId }`, siguiendo el mismo patrón que el endpoint `POST /api/v1/sync` que devuelve 200 con JSON. Esto permite al cliente confirmar qué recurso fue cancelado y es la convención estándar para operaciones exitosas.

B) 204 No Content. Es la convención HTTP para operaciones DELETE exitosas: indica que la acción se completó pero no hay contenido en la respuesta. Se usa `new NextResponse(null, { status: 204 })` en lugar de `NextResponse.json()`.

C) 200 sin cuerpo. Aunque el código especifica `status: 204`, `new NextResponse(null, { status: 204 })` en Next.js App Router se transforma automáticamente en un 200 porque el framework normaliza todas las respuestas exitosas sin cuerpo al código de estado 200.

D) 404 Not Found, ya que después de cancelar la reserva de la base de datos el recurso deja de existir, y la convención REST indica que el código de estado debe reflejar el estado final del recurso tras completar la operación.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: B**

**¿Por qué es correcta?**  
HTTP define 204 No Content como el código apropiado para operaciones DELETE exitosas que no devuelven cuerpo. El código usa explícitamente `new NextResponse(null, { status: 204 })`, que respeta esta convención.

**¿Por qué las demás no lo son?**
- **A)** Aunque algunas APIs devuelven 200 con cuerpo para DELETE, la convención HTTP más precisa es 204 cuando no hay contenido que devolver. El código implementado ya sigue esta convención.
- **C)** Next.js no transforma 204 en 200. `new NextResponse(null, { status: 204 })` devuelve exactamente un 204 al cliente.
- **D)** 404 indica que el recurso no fue encontrado *antes* de intentar la operación. Una vez que la operación DELETE es exitosa, 204 es el código correcto; el recurso ya fue eliminado/cancelado, no "no encontrado".

</details>


## Pregunta 28

Las variables de entorno de la aplicación son:

```
AUTH0_DOMAIN=unirstay.eu.auth0.com
AUTH0_CLIENT_ID=abc123def456
AUTH0_CLIENT_SECRET=secreto_muy_largo
AUTH0_SECRET=clave_aleatoria_32_caracteres
APP_BASE_URL=http://localhost:3000
```

¿Para qué se utiliza `AUTH0_SECRET` y en qué se diferencia de `AUTH0_CLIENT_SECRET`?

A) Son funcionalmente equivalentes. Ambas se utilizan para autenticarse contra la API de Auth0 durante el flujo OAuth. `AUTH0_SECRET` es simplemente un alias de `AUTH0_CLIENT_SECRET` que el SDK de Next.js acepta para mantener compatibilidad con versiones anteriores del paquete `@auth0/nextjs-auth0`.

B) `AUTH0_CLIENT_SECRET` es la clave secreta de la aplicación registrada en Auth0, usada para el intercambio de códigos OAuth. `AUTH0_SECRET` es una clave local que usa el SDK de Next.js para encriptar la cookie de sesión (`__session`). Si se cambia `AUTH0_SECRET`, todas las sesiones activas se invalidan.

C) `AUTH0_SECRET` es la clave privada que el servidor utiliza para firmar y verificar los tokens JWT generados durante el flujo de autenticación. `AUTH0_CLIENT_SECRET` es la clave simétrica que se usa exclusivamente para encriptar las cookies de sesión en el navegador del usuario y proteger los datos sensibles en tránsito.

D) `AUTH0_SECRET` es opcional y solo se utiliza en el entorno de producción para añadir una capa extra de seguridad. En desarrollo (`NODE_ENV=development`), el SDK de Auth0 desactiva automáticamente la encriptación de cookies para facilitar la depuración, y utiliza únicamente `AUTH0_CLIENT_SECRET` para todas las operaciones criptográficas.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: B**

**¿Por qué es correcta?**  
`AUTH0_CLIENT_SECRET` es proporcionada por Auth0 para autenticar la aplicación en el flujo OAuth (intercambio de código por token). `AUTH0_SECRET` es generada localmente por el equipo y la usa el SDK de `@auth0/nextjs-auth0` para firmar y encriptar la cookie de sesión del usuario. Rotar `AUTH0_SECRET` invalida todas las sesiones existentes.

**¿Por qué las demás no lo son?**
- **A)** No son equivalentes. Tienen propósitos completamente diferentes: una es para el flujo OAuth con Auth0, la otra para encriptar cookies de sesión localmente.
- **C)** Invierte los roles: `AUTH0_CLIENT_SECRET` se usa en el flujo OAuth, no para cookies. `AUTH0_SECRET` es para cookies de sesión, no para firmar JWTs del flujo OAuth.
- **D)** `AUTH0_SECRET` es obligatoria en todos los entornos. El SDK no desactiva la encriptación de cookies en desarrollo; sin `AUTH0_SECRET`, la aplicación fallará al iniciar.

</details>


## Pregunta 29

El equipo implementa la siguiente función para mostrar precios localizados:

```js
function formatPrice(price, lang) {
  return new Intl.NumberFormat(lang, {
    style: 'currency',
    currency: lang === 'en' ? 'USD' : 'EUR',
  }).format(price);
}
```

Para el precio `850.75`, ¿qué devuelve `formatPrice(850.75, 'es')`, `formatPrice(850.75, 'en')` y `formatPrice(850.75, 'fr')`?

A) `"850.75 EUR"`, `"850.75 USD"`, `"850.75 EUR"`. `Intl.NumberFormat` no cambia el formato, solo añade la moneda.

B) `"850,75 €"` (español), `"$850.75"` (inglés), `"850,75 €"` (francés). `Intl.NumberFormat` ajusta automáticamente los separadores de miles, decimales y la posición del símbolo de moneda según el locale.

C) Los tres devuelven `"850.75 EUR"` porque JavaScript usa el formato inglés internamente.

D) Error en tiempo de ejecución porque `Intl.NumberFormat` no está disponible en Server Components.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: B**

**¿Por qué es correcta?**  
`Intl.NumberFormat` adapta automáticamente el formato numérico al locale: separadores de miles y decimales, posición del símbolo de moneda (antes o después), y espacios. `"es"` usa coma decimal y euro posterior; `"en"` usa punto decimal y dólar anterior.

**¿Por qué las demás no lo son?**
- **A)** `Intl.NumberFormat` hace mucho más que "añadir la moneda". Transforma completamente la representación numérica según las convenciones culturales del locale.
- **C)** JavaScript no fuerza el formato inglés cuando se especifica un locale diferente. `Intl.NumberFormat('es')` devuelve formato español.
- **D)** `Intl.NumberFormat` es una API estándar de JavaScript (ECMAScript Intl) disponible tanto en Node.js como en el navegador. Funciona perfectamente en Server Components.

</details>


## Pregunta 30

El equipo implementa el sitemap dinámico de UnirStay:

```js
// src/app/sitemap.js
export default async function sitemap() {
  const destinations = await getDestinationsFromStore();
  const locales = ['es', 'en', 'fr'];

  const destinationUrls = destinations.flatMap((dest) =>
    locales.map((lang) => ({
      url: `https://unirstay.com/${lang}/stays/${dest.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `https://unirstay.com/${l}/stays/${dest.slug}`])
        ),
      },
    }))
  );

  return [...homeUrls, ...destinationUrls];
}
```

¿Para qué sirve la propiedad `alternates.languages` en cada entrada del sitemap?

A) Indica a los motores de búsqueda que esas URLs son traducciones del mismo contenido. Genera etiquetas `hreflang` que ayudan a Google a mostrar la versión correcta del idioma en los resultados de búsqueda según la región del usuario.

B) Fuerza al navegador del usuario a redirigir automáticamente al idioma correcto usando la información del sitemap.

C) Es un requisito obligatorio de Next.js. Sin `alternates.languages` el sitemap no se genera.

D) Crea copias de la página en los otros idiomas durante el build time para mejorar el rendimiento.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: A**

**¿Por qué es correcta?**  
`alternates.languages` genera etiquetas `hreflang` en el sitemap XML. Los motores de búsqueda (Google, Bing) las usan para entender que varias URLs son versiones lingüísticas del mismo contenido, mostrando al usuario el idioma adecuado según su configuración regional.

**¿Por qué las demás no lo son?**
- **B)** El sitemap no fuerza redirecciones del navegador. Las redirecciones de idioma se gestionan en el proxy/middleware, no en el sitemap.
- **C)** `alternates.languages` es completamente opcional. El sitemap se genera correctamente sin esta propiedad, aunque perdería información de internacionalización para SEO.
- **D)** El sitemap no crea páginas ni afecta al build. Es un archivo descriptivo que los motores de búsqueda consultan para descubrir URLs; no genera contenido.

</details>



## Pregunta 31

El proxy de UnirStay está configurado para redirigir usuarios sin prefijo de idioma:

```js
export function proxy(request) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (!pathnameHasLocale) {
    const locale = getLocale(request); // Lee Accept-Language
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  return NextResponse.next();
}
```

Si un usuario con navegador configurado en italiano accede a `/stays/rome` (sin prefijo de idioma), ¿qué ocurre?

A) Se muestra un error 404 porque la ruta `/stations/rome` no existe sin el segmento `[lang]`.

B) El proxy detecta que la URL no tiene prefijo de locale, lee la cabecera `Accept-Language` del navegador, determina que el idioma preferido es italiano y redirige a `/it/stays/rome`.

C) Se muestra la página en el idioma por defecto (español) porque el proxy no redirige a usuarios que ya están en una ruta válida.

D) El proxy añade el prefijo pero no redirige; hace un rewrite interno invisible para el usuario.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: B**

**¿Por qué es correcta?**  
El proxy verifica si la URL ya tiene un prefijo de locale. Si no lo tiene, lee `Accept-Language` del navegador, determina el idioma preferido del usuario y redirige (HTTP 307/308) a la URL con el prefijo correspondiente.

**¿Por qué las demás no lo son?**
- **A)** La redirección ocurre antes de que Next.js intente resolver la ruta sin prefijo. El usuario nunca llega a una URL sin `[lang]`.
- **C)** El proxy sí redirige explícitamente cuando no hay prefijo de locale. No usa el idioma por defecto silenciosamente.
- **D)** El código usa `NextResponse.redirect(request.nextUrl)`, que es una redirección visible (cambia la URL del navegador), no un rewrite interno.

</details>


## Pregunta 32

El equipo implementa `generateMetadata` en la página de detalle de un alojamiento:

```js
export async function generateMetadata({ params }) {
  const { lang, id } = await params;
  const stay = await getStayDetails(id);
  const dict = await getDictionary(lang);

  const title = `${stay.name} - ${dict.metadata.stay.title}`;
  const description = stay.description.slice(0, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      locale: lang,
      type: 'website',
      siteName: 'UnirStay',
      images: [{ url: stay.mainImage, width: 1200, height: 630 }],
    },
  };
}
```

¿Qué información proporciona el bloque `openGraph` y a quién va dirigido?

A) `openGraph` genera las etiquetas meta de Open Graph Protocol, que son leídas por redes sociales (Facebook, Twitter, LinkedIn, WhatsApp) cuando alguien comparte la URL. Definen cómo se muestra el enlace compartido (título, descripción, imagen, tipo de contenido).

B) `openGraph` es un módulo de telemetría integrado en Next.js que recopila métricas de rendimiento de la página y las envía automáticamente a un dashboard de análisis accesible desde la consola de Vercel.

C) `openGraph` genera un grafo de dependencias entre los componentes de la página durante el build time, permitiendo a Next.js analizar qué módulos se importan y optimizar el tree-shaking y code-splitting.

D) `openGraph` solo afecta a los resultados de búsqueda de Google, proporcionando rich snippets con título y descripción mejorados. No tiene ningún efecto en redes sociales, ya que estas utilizan sus propias etiquetas meta propietarias independientes de Open Graph.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: A**

**¿Por qué es correcta?**  
El bloque `openGraph` en `generateMetadata` genera etiquetas `<meta property="og:*">` en el HTML. Las redes sociales y plataformas de mensajería las leen para construir tarjetas de previsualización (título, descripción, imagen) cuando un usuario comparte la URL.

**¿Por qué las demás no lo son?**
- **B)** Next.js tiene telemetría separada (opcional y anónima) que no se configura mediante `openGraph` en `generateMetadata`.
- **C)** El análisis de dependencias para tree-shaking lo realiza el bundler de Next.js internamente, no a través de la configuración de metadatos de la página.
- **D)** Aunque Google puede usar algunas etiquetas OG, su propósito principal son las redes sociales. Twitter, Facebook, LinkedIn y WhatsApp usan activamente Open Graph para sus tarjetas de previsualización.

</details>


## Pregunta 33

La página de checkout de UnirStay necesita datos siempre frescos del usuario y sus reservas:

```js
// checkout/page.js
export const dynamic = 'force-dynamic';

export default async function CheckoutPage() {
  const session = await auth0.getSession();
  if (!session) redirect('/api/auth/login');

  const bookings = await getUserBookings(session.user.sub);
  return <CheckoutClient bookings={bookings} />;
}
```

¿Qué efecto tiene `export const dynamic = 'force-dynamic'`?

A) Convierte la página en un Client Component que se renderiza completamente en el navegador.

B) Obliga a Next.js a renderizar la página en el servidor en cada petición (SSR puro), sin usar ninguna versión cacheada de la página ni de los datos internos. La petición siempre ejecuta el código del Server Component.

C) Activa el hot reload automático de la página cada vez que cambian los datos en la base de datos.

D) Fuerza a que la página se genere estáticamente en el build, ignorando cualquier lógica dinámica de sesión.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: B**

**¿Por qué es correcta?**  
`dynamic = 'force-dynamic'` fuerza el renderizado dinámico (SSR) en cada petición. La página no se cachea ni se genera estáticamente; cada visita ejecuta el Server Component desde cero, obteniendo datos frescos y verificando la sesión.

**¿Por qué las demás no lo son?**
- **A)** `dynamic` no convierte un Server Component en Client Component. El componente sigue ejecutándose en el servidor; solo fuerza que lo haga en cada petición.
- **C)** Next.js no tiene hot reload basado en cambios de BD. `force-dynamic` solo controla la estrategia de renderizado de la petición HTTP.
- **D)** Es lo opuesto: `force-dynamic` desactiva la generación estática y fuerza el renderizado en cada petición.

</details>


## Pregunta 34

El equipo crea un archivo `error.js` para manejar errores en la ruta de búsqueda de alojamientos:

```jsx
'use client';

export default function SearchError({ error, reset }) {
  return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-bold text-stay-error">Error al cargar alojamientos</h2>
      <p className="text-stay-muted">{error.message}</p>
      <button onClick={reset} className="mt-4 px-4 py-2 bg-stay-teal text-white rounded-lg">
        Intentar de nuevo
      </button>
    </div>
  );
}
```

¿Qué ocurre cuando el componente `page.js` de la misma ruta lanza un error durante el fetch de datos?

A) Next.js muestra automáticamente el componente `error.js` como fallback, pasándole el objeto `error` y una función `reset` que reintenta renderizar la página.

B) El error se propaga hasta el `not-found.js` más cercano, que muestra una página 404.

C) Next.js ignora el error y renderiza la página con datos vacíos, mostrando un estado de carga indefinido.

D) El error provoca un crash de la aplicación y es necesario recargar manualmente el navegador.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: A**

**¿Por qué es correcta?**  
`error.js` es una convención de Next.js App Router que crea automáticamente un Error Boundary de React. Cuando un error ocurre en la ruta, Next.js renderiza el `error.js` más cercano, pasando el error y una función `reset` para reintentar.

**¿Por qué las demás no lo son?**
- **B)** `not-found.js` solo se muestra cuando se llama explícitamente a `notFound()` o cuando una ruta no existe. Los errores de runtime van a `error.js`.
- **C)** Next.js no ignora errores de fetch. Si un Server Component lanza una excepción, se captura en el Error Boundary correspondiente.
- **D)** Los Error Boundaries de React capturan errores dentro de su árbol sin crashar la aplicación completa. El usuario ve el UI de error y puede reintentar.

</details>


## Pregunta 35

El equipo usa `next/link` para la navegación entre destinos:

```jsx
import Link from 'next/link';

<Link href="/es/stays/barcelona" prefetch={true}>
  Ver alojamientos en Barcelona
</Link>
```

¿Qué hace `prefetch={true}` en este componente?

A) Carga la página de destino completamente en el navegador cuando el usuario hace hover sobre el enlace, para que la navegación sea instantánea.

B) En producción, Next.js precarga en background la página de destino (su JS y datos) cuando el enlace entra en el viewport. Esto hace que la navegación sea más rápida cuando el usuario finalmente hace clic.

C) Descarga todas las imágenes de la página de destino inmediatamente para evitar carga posterior.

D) Obliga a que la navegación sea server-side, ignorando cualquier caché del cliente.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: B**

**¿Por qué es correcta?**  
Con `prefetch={true}` (comportamiento por defecto en Next.js), el framework precarga la ruta de destino en background cuando el enlace es visible en el viewport. Esto incluye el código JS y los datos de la página, reduciendo el tiempo de navegación.

**¿Por qué las demás no lo son?**
- **A)** El prefetch no espera al hover; comienza cuando el enlace es visible en el viewport. En el hover, Next.js puede hacer un prefetch adicional más agresivo.
- **C)** `next/link` no precarga imágenes de la página de destino. Prefiere las rutas y datos de la aplicación.
- **D)** `prefetch` no controla si la navegación es SSR o CSR. Es una optimización de carga previa de recursos estáticos y datos.

</details>


## Pregunta 36

Un desarrollador quiere mostrar un skeleton mientras carga la sección de reseñas de un alojamiento:

```jsx
// stay/[id]/page.js
import { Suspense } from 'react';
import StayDetails from './StayDetails';
import ReviewsSection from './ReviewsSection';
import ReviewsSkeleton from './ReviewsSkeleton';

export default async function StayPage({ params }) {
  const { id } = await params;
  const stay = await getStayDetails(id);

  return (
    <div>
      <StayDetails data={stay} />
      <Suspense fallback={<ReviewsSkeleton />}>
        <ReviewsSection stayId={id} />
      </Suspense>
    </div>
  );
}
```

¿Cuál es la ventaja de usar `Suspense` explícito frente a un `loading.js` en la misma ruta?

A) `loading.js` reemplaza toda la página mientras carga cualquier dato. `Suspense` permite mostrar contenido ya cargado (como `StayDetails`) mientras una sección específica (`ReviewsSection`) carga en paralelo, mejorando la experiencia de usuario.

B) No hay ventaja. Ambos hacen exactamente lo mismo.

C) `Suspense` solo funciona en Client Components, mientras que `loading.js` funciona en Server Components.

D) `loading.js` es más rápido porque se ejecuta antes de que React monte el componente.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: A**

**¿Por qué es correcta?**  
`loading.js` actúa como un fallback global para toda la ruta. `Suspense` permite granularidad: partes de la página pueden renderizarse mientras otras cargan. Esto mejora el tiempo de carga percibido y permite al usuario interactuar con contenido disponible más pronto.

**¿Por qué las demás no lo son?**
- **B)** Hay una diferencia clave de granularidad. `loading.js` = fallback de ruta completa; `Suspense` = fallback de subárbol específico.
- **C)** `Suspense` funciona tanto en Server Components como en Client Components. Es una API de React universal.
- **D)** El rendimiento es similar; la diferencia está en la experiencia de usuario y la granularidad del loading, no en la velocidad de ejecución.

</details>


## Pregunta 37

Un Client Component implementa filtros de búsqueda usando query params:

```jsx
'use client';
import { useSearchParams, useRouter } from 'next/navigation';

export default function StayFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const minPrice = searchParams.get('minPrice') || '';

  const handlePriceChange = (value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set('minPrice', value);
    else params.delete('minPrice');
    router.push(`/es/stays?${params.toString()}`);
  };

  // ...
}
```

¿Qué ventaja tiene usar `URLSearchParams` sobre concatenar strings manualmente?

A) `URLSearchParams` maneja automáticamente la codificación de caracteres especiales (espacios, acentos, símbolos), evita duplicados de claves y produce una query string válida sin errores de formato manual.

B) `URLSearchParams` es más rápido en términos de rendimiento que la concatenación de strings.

C) Next.js requiere obligatoriamente `URLSearchParams` para manipular query params. La concatenación manual de strings lanza un error de tipo.

D) `URLSearchParams` actualiza automáticamente el estado global de la aplicación cuando se modifica un parámetro.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: A**

**¿Por qué es correcta?**  
`URLSearchParams` proporciona una API estructurada para manipular query strings: codifica/decodifica caracteres especiales automáticamente (ej: `encodeURIComponent`), evita duplicados de claves, y produce siempre un formato válido (`key=value&key2=value2`).

**¿Por qué las demás no lo son?**
- **B)** Para query strings pequeños, el rendimiento es negligible. La ventaja principal es la corrección y seguridad, no la velocidad.
- **C)** Next.js no impone ninguna restricción sobre cómo construir URLs. Se puede concatenar strings manualmente, aunque es más propenso a errores.
- **D)** `URLSearchParams` no tiene conexión con el estado global de React. Es una API nativa del navegador/Node.js para manipular URLs.

</details>


## Pregunta 38

El equipo tiene la siguiente estructura de layouts:

```
src/app/
  layout.js              (RootLayout: html, body, fuentes)
  [lang]/
    layout.js            (LangLayout: diccionario, dirección RTL/LTR)
    (main)/
      layout.js          (MainLayout: Header, Footer)
      stays/
        [destination]/
          layout.js      (DestinationLayout: breadcrumb, mapa)
          page.js
```

¿En qué orden se anidan los layouts cuando un usuario visita `/es/stays/barcelona`?

A) `RootLayout → LangLayout → MainLayout → DestinationLayout`, cada uno envolviendo al siguiente y combinando sus elementos.

B) Solo se usa `DestinationLayout` porque es el más específico y reemplaza a todos los demás.

C) `RootLayout → MainLayout → LangLayout → DestinationLayout`, porque los Route Groups tienen prioridad sobre los segmentos dinámicos.

D) Los layouts no se anidan; cada ruta usa únicamente el layout más cercano en su carpeta.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: A**

**¿Por qué es correcta?**  
Next.js anida layouts siguiendo la jerarquía de rutas de afuera hacia adentro: `app/layout.js` → `[lang]/layout.js` → `(main)/layout.js` → `stays/[destination]/layout.js`. Cada layout recibe `children` que es el resultado del siguiente layout más específico.

**¿Por qué las demás no lo son?**
- **B)** Los layouts no se reemplazan; se acumulan. Cada nivel de la ruta puede aportar un layout que envuelve al contenido de sus hijos.
- **C)** El orden sigue la estructura de carpetas, no una prioridad especial de Route Groups. `[lang]` está antes que `(main)` en la jerarquía física.
- **D)** Los layouts se anidan explícitamente en Next.js App Router. Es uno de sus patrones fundamentales.

</details>


## Pregunta 39

El equipo quiere saber si puede usar el paquete `sharp` (procesamiento de imágenes) dentro de un middleware:

```js
// middleware.js
import { NextResponse } from 'next/server';
import sharp from 'sharp';

export async function middleware(request) {
  if (request.nextUrl.pathname.startsWith('/api/images/optimize')) {
    const image = await sharp('/tmp/upload.jpg').resize(800).toBuffer();
    return new NextResponse(image, { headers: { 'Content-Type': 'image/jpeg' } });
  }
  return NextResponse.next();
}
```

¿Por qué este código no funcionará?

A) Porque `sharp` no soporta el formato JPEG.

B) Porque el middleware de Next.js se ejecuta en Edge Runtime, que no incluye las APIs nativas de Node.js necesarias para compilar y ejecutar módulos nativos de C++ como `sharp` (que depende de `libvips`). Los módulos nativos de Node.js solo funcionan en Node.js Runtime.

C) Porque el middleware no puede interceptar rutas que empiecen con `/api`.

D) Porque `sharp` requiere una licencia comercial para usarla en proyectos Next.js.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: B**

**¿Por qué es correcta?**  
El middleware de Next.js se ejecuta en Edge Runtime, un entorno ligero basado en Web APIs. `sharp` es un módulo nativo de Node.js compilado con C++ (libvips) que requiere APIs de sistema de archivos y bindings nativos no disponibles en Edge Runtime. El procesamiento de imágenes debe hacerse en Route Handlers o funciones serverless que usen Node.js Runtime.

**¿Por qué las demás no lo son?**
- **A)** `sharp` soporta múltiples formatos incluyendo JPEG, PNG, WebP, AVIF, etc. El formato no es el problema.
- **C)** El middleware puede interceptar cualquier ruta, incluidas las de `/api`. La limitación es el runtime, no el scope de rutas.
- **D)** `sharp` es software libre (licencia Apache 2.0) y no requiere licencia comercial.

</details>


## Pregunta 40

El equipo configura `generateStaticParams` con fallback:

```js
export async function generateStaticParams() {
  const stays = await getStaysFromStore();
  return stays.slice(0, 10).map((s) => ({ id: String(s.id) }));
}

export const dynamicParams = true;
```

¿Qué ocurre cuando un usuario visita `/es/stay/999` si el alojamiento con `id=999` no está en los 10 generados estáticamente?

A) Next.js devuelve 404 porque el parámetro no fue generado estáticamente.

B) Next.js genera la página bajo demanda (on-demand) en el servidor la primera vez que se solicita, y la sirve. Las siguientes visitas usan la versión generada. Esto se conoce como "fallback" dinámico.

C) Next.js redirige automáticamente a la página de búsqueda de alojamientos.

D) La página muestra datos vacíos porque `params.id` será `undefined`.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: B**

**¿Por qué es correcta?**  
`dynamicParams = true` (valor por defecto en App Router) habilita la generación bajo demanda. Si una ruta no fue generada estáticamente durante el build, Next.js la renderiza en el servidor en la primera petición, la almacena en caché y la sirve. Las siguientes peticiones usan la versión ya generada.

**¿Por qué las demás no lo son?**
- **A)** Eso ocurriría solo si `dynamicParams = false`, que desactiva la generación bajo demanda y fuerza un 404 para rutas no pre-generadas.
- **C)** Next.js no redirige automáticamente a otra página cuando una ruta dinámica existe pero no fue pre-generada. Intenta generarla bajo demanda.
- **D)** `params.id` siempre tendrá el valor de la URL (`"999"`). Si el alojamiento no existe en BD, el componente debe manejar ese caso (ej: llamar a `notFound()`), pero el parámetro en sí está definido.

</details>



## Pregunta 41

El equipo configura el middleware para proteger rutas de administración:

```js
// middleware.js
import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

export async function middleware(request) {
  const session = await auth0.getSession(request);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') && (!session || session.user.role !== 'admin')) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
```

¿Qué ocurre cuando un usuario no autenticado intenta acceder a `/admin/dashboard`?

A) Next.js devuelve 404 porque la ruta `/admin/dashboard` no existe en el sistema de archivos.

B) El middleware intercepta la petición gracias al `matcher`, verifica que no hay sesión y redirige a `/unauthorized`.

C) La página se renderiza normalmente porque el middleware solo se ejecuta para rutas que coincidan exactamente con `/admin/:path*`, pero `/admin/dashboard` tiene un segmento adicional.

D) El middleware se ejecuta para **todas** las rutas de la aplicación, no solo las del `matcher`, porque `config.matcher` solo filtra cuáles se registran en el build pero no restringe la ejecución en runtime.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: B**

**¿Por qué es correcta?**  
`config.matcher` define las rutas que activan el middleware. `/admin/:path*` coincide con `/admin/dashboard` (el `*` captura cualquier subruta). El middleware verifica la sesión, detecta que no hay autenticación y ejecuta la redirección a `/unauthorized`.

**¿Por qué las demás no lo son?**
- **A)** Si existe la ruta en el sistema de archivos, Next.js la sirve (o intenta hacerlo). El middleware se ejecuta antes del renderizado. Si no existe la ruta física, Next.js devolvería 404, pero el middleware actúa primero.
- **C)** `:path*` en el matcher captura cualquier cantidad de segmentos adicionales, incluyendo `/dashboard`. Es un patrón de wildcard.
- **D)** `config.matcher` restringe efectivamente las rutas que ejecutan el middleware. Rutas fuera del matcher no activan `middleware()`.

</details>


## Pregunta 42

El equipo implementa un Route Handler para gestionar una reserva específica:

```js
// api/v1/bookings/[bookingId]/route.js
import { NextResponse } from 'next/server';
import { getBookingById, updateBookingStatus } from '../../_store';

export async function GET(request, { params }) {
  const { bookingId } = await params;
  const booking = await getBookingById(bookingId);
  if (!booking) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ data: booking });
}

export async function PATCH(request, { params }) {
  const { bookingId } = await params;
  const body = await request.json();
  const updated = await updateBookingStatus(bookingId, body.status);
  return NextResponse.json({ data: updated });
}
```

Si un cliente envía una petición `DELETE /api/v1/bookings/123`, ¿qué ocurre?

A) El endpoint devuelve 404 porque no existe un archivo `delete.js` en la carpeta de la ruta.

B) Next.js devuelve automáticamente `405 Method Not Allowed` porque no se exportó ninguna función `DELETE` en el Route Handler.

C) Se ejecuta `PATCH` porque Next.js usa el primer handler disponible cuando no hay coincidencia exacta de método HTTP.

D) La petición cae en un error 500 porque el framework no sabe cómo enrutar métodos HTTP no implementados.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: B**

**¿Por qué es correcta?**  
Next.js Route Handlers enrutan automáticamente las peticiones a la función exportada que coincide con el método HTTP. Si no existe un export para ese método (en este caso `DELETE`), Next.js responde con `405 Method Not Allowed` de forma nativa.

**¿Por qué las demás no lo son?**
- **A)** Los Route Handlers no requieren archivos separados por método. Un solo `route.js` puede exportar múltiples funciones (GET, POST, PATCH, DELETE). La ausencia de un método no causa 404.
- **C)** Next.js nunca ejecuta un handler de método diferente. Cada método HTTP tiene su propia función exportada; si no existe, devuelve 405.
- **D)** Next.js maneja métodos no implementados de forma controlada (405), no como un error 500 inesperado.

</details>


## Pregunta 43

Un Server Component necesita leer una cookie de preferencias del usuario para aplicar un tema:

```js
// app/[lang]/(main)/layout.js
import { cookies } from 'next/headers';

export default async function MainLayout({ children }) {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme')?.value || 'light';

  return (
    <div data-theme={theme}>
      {children}
    </div>
  );
}
```

¿Por qué `cookies()` debe esperarse con `await`?

A) Porque `cookies()` es una función asíncrona que lee las cabeceras de la petición HTTP actual, que solo están disponibles de forma asíncrona en el contexto del renderizado de Server Components en Next.js.

B) Porque las cookies se almacenan en la base de datos y `cookies()` realiza una consulta a PostgreSQL para obtenerlas.

C) No es necesario usar `await`. `cookies()` devuelve un objeto síncrono y el `await` en el código anterior es un error de tipos que TypeScript marcaría.

D) Porque `cookies()` realiza una petición HTTP interna al servidor de cookies de Next.js que corre en un puerto separado.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: A**

**¿Por qué es correcta?**  
En Next.js App Router, `cookies()` (y `headers()`) son funciones asíncronas que acceden a los datos de la petición HTTP entrante. El contexto de renderizado de Server Components requiere que estas APIs se esperen asíncronamente para garantizar que los datos de la petición estén disponibles.

**¿Por qué las demás no lo son?**
- **B)** Las cookies vienen de la cabecera `Cookie` de la petición HTTP, no de PostgreSQL. No hay consulta a base de datos.
- **C)** En versiones recientes de Next.js App Router, `cookies()` y `headers()` son funciones asíncronas. El `await` es obligatorio; sin él, el código lanzaría un error.
- **D)** No existe un "servidor de cookies separado". Next.js lee directamente las cabeceras de la petición HTTP actual que está procesando.

</details>


## Pregunta 44

El equipo crea un formulario de contacto que usa una Server Action:

```jsx
// ContactForm.jsx
'use client';
import { useFormStatus } from 'react-dom';
import { submitContactForm } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="bg-stay-teal text-white px-4 py-2 rounded-lg">
      {pending ? 'Enviando...' : 'Enviar mensaje'}
    </button>
  );
}

export default function ContactForm() {
  return (
    <form action={submitContactForm}>
      <input name="name" placeholder="Nombre" required />
      <input name="email" type="email" placeholder="Email" required />
      <textarea name="message" placeholder="Mensaje" required />
      <SubmitButton />
    </form>
  );
}
```

¿Qué hace `useFormStatus` y por qué se usa en un componente separado (`SubmitButton`) en lugar de directamente en `ContactForm`?

A) `useFormStatus` lee el estado de envío del formulario más cercano en el árbol de React. Solo funciona dentro de un componente renderizado *dentro* del `<form>` (no en el mismo componente que define el `<form>`), por eso `SubmitButton` se extrae como componente hijo.

B) `useFormStatus` solo funciona en Server Components, por lo que debe estar en un archivo separado sin `'use client'`. `ContactForm` es Client Component, así que delega el botón a un Server Component.

C) Es una convención de estilo. `useFormStatus` puede usarse en cualquier componente, Client o Server, sin restricciones de ubicación en el árbol.

D) `useFormStatus` requiere que el formulario tenga un `id` y el botón un `form` attribute que apunte a ese `id`.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: A**

**¿Por qué es correcta?**  
`useFormStatus` es un hook de React DOM que lee el estado de envío (`pending`) del formulario ancestro más cercano. Por diseño, solo funciona en componentes renderizados *dentro* del `<form>`. Si se usara directamente en `ContactForm` (que define el `<form>`), no tendría acceso al estado de envío porque el formulario aún no está montado en el árbol cuando se evalúa el hook.

**¿Por qué las demás no lo son?**
- **B)** `useFormStatus` es un hook de React y por tanto funciona en Client Components. `SubmitButton` también es Client Component (está en el mismo archivo con `'use client'`).
- **C)** `useFormStatus` tiene una restricción estricta de ubicación: debe usarse dentro del árbol del `<form>`, no en el componente que lo define. No es "solo una convención de estilo".
- **D)** `useFormStatus` no requiere `id` ni `form` attribute. Funciona por proximidad en el árbol de React DOM, no por referencia explícita.

</details>


## Pregunta 45

El equipo experimenta configurando un Route Handler con Edge Runtime:

```js
// api/v1/edge-test/route.js
export const runtime = 'edge';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');

  return new Response(JSON.stringify({ city, runtime: 'edge' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
```

¿Cuál es la limitación principal de este Route Handler si el equipo intenta añadir una conexión a PostgreSQL dentro de él?

A) No hay limitación. El paquete `pg` funciona correctamente en Edge Runtime porque soporta conexiones TCP directas.

B) Edge Runtime no incluye las APIs nativas de Node.js (`net`, `tls`, `dns`) que el paquete `pg` necesita para conectar con PostgreSQL. Por eso, las conexiones a base de datos deben hacerse desde Route Handlers o Server Components que usen `runtime = 'nodejs'` (valor por defecto).

C) Edge Runtime no soporta la función `JSON.stringify`, por lo que la respuesta fallaría.

D) El problema es que `request.url` no incluye query params en Edge Runtime; debe usarse `request.nextUrl.searchParams`.

<details>
<summary><b>Ver respuesta y explicación</b></summary>

**Respuesta correcta: B**

**¿Por qué es correcta?**  
Edge Runtime es un entorno ligero basado en Web APIs que deliberadamente excluye APIs nativas de Node.js como `net`, `tls` y `dns`. El paquete `pg` depende de estas APIs para establecer conexiones TCP a PostgreSQL, por lo que no puede ejecutarse en Edge Runtime. Las conexiones a BD requieren Node.js Runtime.

**¿Por qué las demás no lo son?**
- **A)** El paquete `pg` no funciona en Edge Runtime. Esta es una limitación bien documentada del entorno Edge.
- **C)** Edge Runtime soporta completamente `JSON.stringify` y la API `Response` de fetch. La respuesta JSON no es el problema.
- **D)** En un Route Handler de Next.js, `request.url` sí incluye la URL completa con query params. `URL` es una Web API estándar disponible en Edge Runtime.

</details>


