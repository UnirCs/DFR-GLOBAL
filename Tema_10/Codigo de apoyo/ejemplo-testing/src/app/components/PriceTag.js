// app/components/PriceTag.js (Server Component síncrono)
export default function PriceTag({ amount, currency }) {
  const formatted = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
  }).format(amount);

  return <span aria-label="price">{formatted}</span>;
}
