// app/api/books/route.js
import { NextResponse } from "next/server";
import { withErrorHandling, parseJson, HttpError } from "../_http";
import { validateBookCreate } from "../_validators";
import { listBooks, createBook } from "../_store";

export const POST = withErrorHandling(async function POST(request) {
  const body = await parseJson(request);
  const input = validateBookCreate(body);

  // Ejemplo de conflicto lógico ficticio: título único
  const exists = listBooks().some(
    (b) => b.title.toLowerCase() === input.title.toLowerCase()
  );
  if (exists) {
    throw new HttpError(409, "DUPLICATE_TITLE", "Ya existe un libro con ese título.");
  }

  const created = createBook(input);

  return NextResponse.json(
    { data: created },
    { status: 201, headers: { Location: `/api/books/${created.id}` } }
  );
});

export const GET = withErrorHandling(async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim().toLowerCase() || "";

  let results = listBooks();

  if (q) {
    results = results.filter(
      (book) =>
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({ data: results, count: results.length }, { status: 200 });
});
