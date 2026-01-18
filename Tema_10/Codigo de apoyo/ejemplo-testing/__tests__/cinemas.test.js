/**
 * @jest-environment node
 */
// __tests__/cinemas.test.js
// Test de la función getCinemas (Server Component asíncrono - testeamos la lógica)
import { getCinemas } from "@/src/lib/cinemas";

describe("getCinemas", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("devuelve la lista de cines cuando la respuesta es ok", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => [{ id: 1, name: "Cine Centro" }],
    });

    const cinemas = await getCinemas();
    expect(cinemas).toEqual([{ id: 1, name: "Cine Centro" }]);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("https://api.example.com/cinemas", {
      cache: "no-store",
    });
  });

  it("lanza error cuando la respuesta no es ok", async () => {
    fetch.mockResolvedValue({ ok: false });

    await expect(getCinemas()).rejects.toThrow("Failed to fetch cinemas");
  });
});
