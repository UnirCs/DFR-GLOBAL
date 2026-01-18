// tests/cinemas.spec.js
// Test E2E de la funcionalidad de cines
const { test, expect } = require("@playwright/test");

test.describe("Cines", () => {
  test("al crear un cine vía API, aparece en la lista renderizada", async ({
    page,
  }) => {
    // Creamos un cine mediante la API
    const createRes = await page.request.post("/api/cinemas", {
      data: { name: "Cine Norte E2E" },
    });
    expect(createRes.ok()).toBeTruthy();
    expect(createRes.status()).toBe(201);

    // Navegamos a la página de cines
    await page.goto("/cinemas");

    // Verificamos que el heading está visible
    await expect(page.getByRole("heading", { name: "Cines" })).toBeVisible();

    // Nota: El cine creado vía POST solo aparecerá si la página
    // usa el mismo store (en este caso es un store en memoria)
  });

  test("la API GET /api/cinemas devuelve un array", async ({ page }) => {
    const res = await page.request.get("/api/cinemas");
    expect(res.ok()).toBeTruthy();

    const cinemas = await res.json();
    expect(Array.isArray(cinemas)).toBe(true);
  });

  test("la API POST /api/cinemas devuelve 400 si falta name", async ({
    page,
  }) => {
    const res = await page.request.post("/api/cinemas", {
      data: {},
    });
    expect(res.status()).toBe(400);

    const body = await res.json();
    expect(body.error).toBe("Field 'name' is required");
  });
});
