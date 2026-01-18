# Ejemplo de Testing en Next.js

Este proyecto demuestra diferentes estrategias de testing para aplicaciones Next.js, incluyendo:

- **Tests unitarios** con Jest y `next/jest`
- **Testing de Server Components** (síncronos y asíncronos)
- **Testing de Route Handlers** (API Routes)
- **Tests End-to-End (E2E)** con Playwright

## 🚀 Instalación

```bash
npm install
```

Para Playwright, también necesitas instalar los navegadores:

```bash
npx playwright install
```

## 📦 Estructura del proyecto

```
ejemplo-testing/
├── __tests__/                    # Tests unitarios con Jest
│   ├── cinemas.test.js           # Test de función asíncrona (fetch)
│   ├── cinemas-route.test.js     # Test de Route Handlers
│   ├── price-tag.test.js         # Test de Server Component síncrono
│   └── profile-page.test.js      # Test con mock de cookies
├── tests/                        # Tests E2E con Playwright
│   ├── cinemas.spec.js           # Test E2E de API y página
│   ├── navigation.spec.js        # Test E2E de navegación
│   └── profile.spec.js           # Test E2E con cookies
├── src/
│   ├── app/
│   │   ├── api/cinemas/route.js  # Route Handler
│   │   ├── cinemas/page.js       # Server Component asíncrono
│   │   ├── components/PriceTag.js # Server Component síncrono
│   │   ├── profile/page.js       # Server Component con cookies
│   │   └── about/page.js         # Página estática
│   └── lib/
│       ├── cinemas.js            # Lógica de fetching
│       └── cinemas-store.js      # Store en memoria
├── jest.config.js                # Configuración de Jest (mínima)
└── playwright.config.js          # Configuración de Playwright
```

## 🧪 Scripts de testing

```bash
# Ejecutar tests unitarios
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con cobertura
npm run test:coverage

# Ejecutar tests E2E (requiere build previo)
npm run build && npm run test:e2e

# Ejecutar tests E2E con UI
npm run test:e2e:ui
```

---

## 📚 Conceptos de Testing en Next.js

### Configuración mínima con `next/jest`

Next.js proporciona `next/jest` que configura Jest automáticamente. Solo necesitas:

**`jest.config.js`**
```js
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

module.exports = createJestConfig({
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["/node_modules/", "/tests/"], // Ignora tests E2E
});
```

> **Nota:** No es necesario `@testing-library/react` para testear Server Components. Puedes testear la lógica directamente llamando a los componentes como funciones.

---

### 1. Testing de Server Components Síncronos

Los Server Components son funciones que retornan JSX. Podemos invocarlos directamente y verificar su output.

**Archivo:** `src/app/components/PriceTag.js`

```jsx
export default function PriceTag({ amount, currency }) {
  const formatted = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
  }).format(amount);

  return <span aria-label="price">{formatted}</span>;
}
```

**Test:** `__tests__/price-tag.test.js`

```jsx
import PriceTag from "@/src/app/components/PriceTag";

describe("PriceTag", () => {
  it("formatea el precio en euros correctamente", () => {
    const result = PriceTag({ amount: 12.5, currency: "EUR" });

    expect(result.props.children).toMatch(/12,50\s?€/);
    expect(result.props["aria-label"]).toBe("price");
  });
});
```

**¿Qué probamos?**
- La lógica de formateo de precios
- Las props del elemento retornado

---

### 2. Testing de Server Components con Cookies/Headers

Mockeamos `next/headers` para simular cookies.

**Archivo:** `src/app/profile/page.js`

```jsx
import { cookies } from "next/headers";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value || "light";

  return (
    <main data-theme={theme}>
      <h1>Perfil</h1>
    </main>
  );
}
```

**Test:** `__tests__/profile-page.test.js`

```jsx
import ProfilePage from "@/src/app/profile/page";

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

import { cookies } from "next/headers";

describe("ProfilePage", () => {
  it("usa la cookie theme para seleccionar el tema", async () => {
    cookies.mockResolvedValue({
      get: (name) => (name === "theme" ? { value: "dark" } : undefined),
    });

    const result = await ProfilePage();

    expect(result.props["data-theme"]).toBe("dark");
  });
});
```

---

### 3. Testing de Funciones Asíncronas (Data Fetching)

Mockeamos `fetch` globalmente y usamos `@jest-environment node` para tener acceso a las Web APIs.

**Archivo:** `src/lib/cinemas.js`

```jsx
export async function getCinemas() {
  const res = await fetch("https://api.example.com/cinemas", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch cinemas");
  return res.json();
}
```

**Test:** `__tests__/cinemas.test.js`

```jsx
/**
 * @jest-environment node
 */
import { getCinemas } from "@/src/lib/cinemas";

describe("getCinemas", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it("devuelve la lista de cines cuando la respuesta es ok", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => [{ id: 1, name: "Cine Centro" }],
    });

    const cinemas = await getCinemas();
    expect(cinemas).toEqual([{ id: 1, name: "Cine Centro" }]);
  });

  it("lanza error cuando la respuesta no es ok", async () => {
    fetch.mockResolvedValue({ ok: false });
    await expect(getCinemas()).rejects.toThrow("Failed to fetch cinemas");
  });
});
```

---

### 4. Testing de Route Handlers

Usamos `@jest-environment node` para tener `Request` y `Response` disponibles.

**Archivo:** `src/app/api/cinemas/route.js`

```jsx
import { listCinemas, createCinema } from "@/src/lib/cinemas-store";

export async function GET() {
  const cinemas = await listCinemas();
  return Response.json(cinemas, { status: 200 });
}

export async function POST(request) {
  const body = await request.json();

  if (!body || typeof body.name !== "string" || body.name.trim() === "") {
    return Response.json({ error: "Field 'name' is required" }, { status: 400 });
  }

  const created = await createCinema({ name: body.name.trim() });
  return Response.json(created, { status: 201 });
}
```

**Test:** `__tests__/cinemas-route.test.js`

```jsx
/**
 * @jest-environment node
 */
jest.mock("../src/lib/cinemas-store");

import { listCinemas, createCinema } from "../src/lib/cinemas-store";
import { GET, POST } from "../src/app/api/cinemas/route";

// Helper para crear un request mock
function createMockRequest(body) {
  return { json: async () => body };
}

describe("Route Handler /api/cinemas", () => {
  it("GET devuelve 200 y la lista de cines", async () => {
    listCinemas.mockResolvedValue([{ id: 1, name: "Cine Centro" }]);

    const res = await GET();

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([{ id: 1, name: "Cine Centro" }]);
  });

  it("POST devuelve 400 si falta name", async () => {
    const res = await POST(createMockRequest({}));

    expect(res.status).toBe(400);
  });

  it("POST devuelve 201 si el body es válido", async () => {
    createCinema.mockResolvedValue({ id: 10, name: "Cine Norte" });

    const res = await POST(createMockRequest({ name: "Cine Norte" }));

    expect(res.status).toBe(201);
  });
});
```

---

### 5. Testing E2E con Playwright

Los tests E2E verifican el funcionamiento completo desde la perspectiva del usuario.

**`playwright.config.js`**
```js
const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "tests",
  use: { baseURL: "http://localhost:3000" },
  webServer: {
    command: "npm run start",
    url: "http://localhost:3000",
  },
});
```

**Test:** `tests/navigation.spec.js`

```jsx
const { test, expect } = require("@playwright/test");

test("navega a /about desde la home", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "About" }).click();
  await expect(page).toHaveURL("/about");
});
```

**Test:** `tests/profile.spec.js`

```jsx
test("muestra el tema dark cuando se establece la cookie", async ({ page, context }) => {
  await context.addCookies([
    { name: "theme", value: "dark", url: "http://localhost:3000" },
  ]);

  await page.goto("/profile");
  await expect(page.getByText("Tu tema actual es: dark")).toBeVisible();
});
```

---

## 📋 Resumen de Tests

| Test | Tipo | Qué prueba | Sobre qué |
|------|------|------------|-----------|
| `cinemas.test.js` | Unitario | Fetching de datos y manejo de errores | Función asíncrona |
| `price-tag.test.js` | Unitario | Formateo de precios | Server Component síncrono |
| `profile-page.test.js` | Unitario | Lectura de cookies y renderizado | Server Component con cookies |
| `cinemas-route.test.js` | Unitario | Validación y CRUD | Route Handlers (GET/POST) |
| `navigation.spec.js` | E2E | Navegación entre páginas | Flujo de usuario |
| `cinemas.spec.js` | E2E | Creación via API y listado | API + Server Component |
| `profile.spec.js` | E2E | Temas con cookies | Cookies en navegador |

---

## 🔑 Tips importantes

1. **`@jest-environment node`**: Usa este docblock en tests que necesiten `Request`, `Response` o `fetch` nativos.

2. **Sin Testing Library**: Para Server Components, no necesitas Testing Library. Llama al componente como función y verifica `result.props`.

3. **Mocks de Next.js**: Mockea `next/headers` para `cookies()` y `headers()`.

4. **Route Handlers**: Crea mocks simples de Request con `{ json: async () => body }`.

---

## 📖 Recursos adicionales

- [Next.js Testing Documentation](https://nextjs.org/docs/app/building-your-application/testing)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Playwright Documentation](https://playwright.dev/docs/intro)
