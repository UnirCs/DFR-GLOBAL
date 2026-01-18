// __tests__/profile-page.test.js
// Test de un Server Component que usa cookies
import ProfilePage from "@/src/app/profile/page";

// Mockeamos next/headers para simular las cookies
jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

import { cookies } from "next/headers";

describe("ProfilePage", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("usa la cookie theme para seleccionar el tema dark", async () => {
    cookies.mockResolvedValue({
      get: (name) => (name === "theme" ? { value: "dark" } : undefined),
    });

    const result = await ProfilePage();

    // Verificamos el atributo data-theme en el elemento main
    expect(result.props["data-theme"]).toBe("dark");
  });

  it("usa el tema light por defecto cuando no hay cookie", async () => {
    cookies.mockResolvedValue({
      get: () => undefined,
    });

    const result = await ProfilePage();

    expect(result.props["data-theme"]).toBe("light");
  });
});
