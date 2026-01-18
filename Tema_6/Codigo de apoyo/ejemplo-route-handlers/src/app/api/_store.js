// app/api/_store.js
const books = new Map();
let nextId = 1;

export function listBooks() {
  return Array.from(books.values());
}

export function getBook(id) {
  return books.get(id) || null;
}

export function createBook({ title, author }) {
  const id = String(nextId++);
  const now = new Date().toISOString();
  const book = { id, title, author, createdAt: now, updatedAt: now };
  books.set(id, book);
  return book;
}

export function replaceBook(id, { title, author }) {
  const existing = getBook(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const replaced = { ...existing, title, author, updatedAt: now };
  books.set(id, replaced);
  return replaced;
}

export function patchBook(id, patch) {
  const existing = getBook(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const updated = {
    ...existing,
    ...patch,
    id: existing.id, // blindaje: nunca permitir cambiar el id
    updatedAt: now,
  };
  books.set(id, updated);
  return updated;
}

export function deleteBook(id) {
  return books.delete(id);
}
