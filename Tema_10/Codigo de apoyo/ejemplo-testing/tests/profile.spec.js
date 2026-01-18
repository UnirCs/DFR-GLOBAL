// tests/profile.spec.js
// Test E2E de la página de perfil
const { test, expect } = require("@playwright/test");

test.describe("Profile Page", () => {
  test("muestra el tema light por defecto", async ({ page }) => {
    await page.goto("/profile");

    await expect(page.getByRole("heading", { name: "Perfil" })).toBeVisible();
    await expect(page.getByText("Tu tema actual es: light")).toBeVisible();
  });

  test("muestra el tema dark cuando se establece la cookie", async ({
    page,
    context,
  }) => {
    // Establecemos la cookie antes de navegar
    await context.addCookies([
      {
        name: "theme",
        value: "dark",
        url: "http://localhost:3000",
      },
    ]);

    await page.goto("/profile");

    await expect(page.getByRole("heading", { name: "Perfil" })).toBeVisible();
    await expect(page.getByText("Tu tema actual es: dark")).toBeVisible();

    // Verificamos el atributo data-theme
    const main = page.locator("main");
    await expect(main).toHaveAttribute("data-theme", "dark");
  });
});
