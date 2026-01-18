// __tests__/price-tag.test.js
// Test de un Server Component síncrono
import PriceTag from "@/src/app/components/PriceTag";

describe("PriceTag", () => {
  it("formatea el precio en euros correctamente", () => {
    const result = PriceTag({ amount: 12.5, currency: "EUR" });

    // El formato puede variar según la versión de Node (con/sin espacio)
    expect(result.props.children).toMatch(/12,50\s?€/);
    expect(result.props["aria-label"]).toBe("price");
  });

  it("formatea el precio en dólares correctamente", () => {
    const result = PriceTag({ amount: 99.99, currency: "USD" });

    expect(result.props.children).toMatch(/99,99\s?US\$/);
  });

  it("formatea precios grandes", () => {
    const result = PriceTag({ amount: 1234.56, currency: "EUR" });

    expect(result.props.children).toContain("1234,56");
  });
});
