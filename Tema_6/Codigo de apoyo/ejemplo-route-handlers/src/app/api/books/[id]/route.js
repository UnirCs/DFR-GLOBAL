// app/api/books/[id]/route.js
import { NextResponse } from "next/server";
import { withErrorHandling, parseJson, HttpError } from "../../_http";
import { validateBookCreate, validateBookPatch } from "../../_validators";
import { getBook, replaceBook, patchBook, deleteBook } from "../../_store";

export const GET = withErrorHandling(async function GET(request, { params }) {
  const { id } = await params;
  const book = getBook(id);
  if (!book) {
    throw new HttpError(404, "NOT_FOUND", `No existe el libro con id ${id}.`);
  }
  return NextResponse.json({ data: book }, { status: 200 });
});

export const PUT = withErrorHandling(async function PUT(request, { params }) {
  const { id } = await params;
  const body = await parseJson(request);
  const input = validateBookCreate(body);

  const updated = replaceBook(id, input);
  if (!updated) {
    throw new HttpError(404, "NOT_FOUND", `No existe el libro con id ${id}.`);
  }

  return NextResponse.json({ data: updated }, { status: 200 });
});

export const PATCH = withErrorHandling(async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await parseJson(request);
  const patch = validateBookPatch(body);

  const updated = patchBook(id, patch);
  if (!updated) {
    throw new HttpError(404, "NOT_FOUND", `No existe el libro con id ${id}.`);
  }

  return NextResponse.json({ data: updated }, { status: 200 });
});

export const DELETE = withErrorHandling(async function DELETE(request, { params }) {
  const { id } = await params;
  const book = getBook(id);
  if (!book) {
    throw new HttpError(404, "NOT_FOUND", `No existe el libro con id ${id}.`);
  }

  deleteBook(id);
  return new Response(null, { status: 204 });
});
