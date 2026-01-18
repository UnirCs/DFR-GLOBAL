import Link from "next/link";

export default function Home() {
  return (
    <div className="home">
      <h1>Route Handlers</h1>
      <p>
        Ejemplo de API REST con Next.js Route Handlers.
        Implementa operaciones CRUD para una colección de libros
        con validación, manejo de errores y respuestas estructuradas.
      </p>
      <Link href="/books" className="btn btn-primary">
        Ver Libros
      </Link>
    </div>
  );
}
