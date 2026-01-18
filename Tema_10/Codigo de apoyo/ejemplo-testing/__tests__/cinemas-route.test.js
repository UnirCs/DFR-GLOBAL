/**
 * @jest-environment node
 */
// __tests__/cinemas-route.test.js
// Test de Route Handlers

// Mockeamos el store de cines ANTES de importar el route handler
jest.mock("../src/lib/cinemas-store");

import { listCinemas, createCinema } from "../src/lib/cinemas-store";
import { GET, POST } from "../src/app/api/cinemas/route";

// Helper para crear un request mock
function createMockRequest(body) {
  return {
    json: async () => body,
  };
}

describe("Route Handler /api/cinemas", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("GET", () => {
    it("devuelve 200 y la lista de cines", async () => {
      listCinemas.mockResolvedValue([{ id: 1, name: "Cine Centro" }]);

      const res = await GET();

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toEqual([{ id: 1, name: "Cine Centro" }]);
      expect(listCinemas).toHaveBeenCalledTimes(1);
    });

    it("devuelve un array vacío cuando no hay cines", async () => {
      listCinemas.mockResolvedValue([]);

      const res = await GET();

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toEqual([]);
    });
  });

  describe("POST", () => {
    it("devuelve 400 si falta el campo name", async () => {
      const req = createMockRequest({});

      const res = await POST(req);

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json).toEqual({ error: "Field 'name' is required" });
      expect(createCinema).not.toHaveBeenCalled();
    });

    it("devuelve 400 si name está vacío", async () => {
      const req = createMockRequest({ name: "   " });

      const res = await POST(req);

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json).toEqual({ error: "Field 'name' is required" });
    });

    it("devuelve 400 si name no es string", async () => {
      const req = createMockRequest({ name: 123 });

      const res = await POST(req);

      expect(res.status).toBe(400);
    });

    it("devuelve 201 y el recurso creado si el body es válido", async () => {
      createCinema.mockResolvedValue({ id: 10, name: "Cine Norte" });

      const req = createMockRequest({ name: "  Cine Norte  " });

      const res = await POST(req);

      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json).toEqual({ id: 10, name: "Cine Norte" });
      expect(createCinema).toHaveBeenCalledWith({ name: "Cine Norte" });
    });
  });
});
