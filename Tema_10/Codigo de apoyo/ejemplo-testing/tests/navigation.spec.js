// tests/navigation.spec.js
// Test E2E de navegación básica
const { test, expect } = require("@playwright/test");

test.describe("Navegación", () => {
  test("navega a /about desde la home", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL("/about");
    await expect(page.getByRole("heading", { name: "About" })).toBeVisible();
  });

  test("la página de about muestra el contenido correcto", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByRole("heading", { name: "About" })).toBeVisible();
    await expect(
      page.getByText("aplicación de ejemplo para aprender testing")
    ).toBeVisible();
  });
});
