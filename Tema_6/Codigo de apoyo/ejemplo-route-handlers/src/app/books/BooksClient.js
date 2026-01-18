// app/books/BooksClient.js
"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch, ApiError } from "@/lib/apiClient";

export default function BooksClient() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const query = useMemo(() => q.trim(), [q]);

  useEffect(() => {
    const ctrl = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const url = query ? `/api/books?q=${encodeURIComponent(query)}` : "/api/books";
        const res = await fetch(url, {
          method: "GET",
          cache: "no-store",
          signal: ctrl.signal,
        });

        // Reutilizamos la misma lógica de interpretación que apiFetch,
        // pero con AbortController resulta cómodo hacerlo directo aquí.
        if (res.status === 204) {
          setItems([]);
          return;
        }

        const payload = await res.json();

        if (!res.ok) {
          const e = payload?.error;
          throw new ApiError(e?.message || "Error cargando libros.", {
            status: res.status,
            code: e?.code || "LOAD_ERROR",
            details: e?.details || null,
            requestId: res.headers.get("x-request-id") || e?.requestId || null,
          });
        }

        setItems(payload.data || []);
      } catch (e) {
        if (e.name === "AbortError") return;
        setError(e);
      } finally {
        setLoading(false);
      }
    }

    load();

    return () => ctrl.abort();
  }, [query]);

  async function onCreate(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const { data } = await apiFetch("/api/books", {
        method: "POST",
        body: { title, author },
      });

      // data tiene la forma { data: createdBook }
      const created = data.data;

      setItems((prev) => [created, ...prev]);
      setTitle("");
      setAuthor("");
    } catch (e) {
      setError(e);
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(id) {
    setError(null);

    // Optimismo controlado: quitamos primero y revertimos si falla.
    const prev = items;
    setItems((current) => current.filter((b) => b.id !== id));

    try {
      await apiFetch(`/api/books/${id}`, { method: "DELETE" });
    } catch (e) {
      setItems(prev);
      setError(e);
    }
  }

  return (
    <div className="container">
      <h1>Libros</h1>

      <div className="search-box">
        <label>
          Buscar:{" "}
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="título o autor"
            className="input"
          />
        </label>
      </div>

      <form onSubmit={onCreate} className="form">
        <div className="form-group">
          <label>
            Título:{" "}
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Autor:{" "}
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="input"
            />
          </label>
        </div>
        <button type="submit" disabled={submitting} className="btn btn-primary">
          {submitting ? "Creando..." : "Crear"}
        </button>
      </form>

      {error ? (
        <div className="error-box">
          <p className="error-title">Error</p>
          <p>
            {error.message}{" "}
            {error.requestId ? <span className="request-id">(requestId: {error.requestId})</span> : null}
          </p>
          {error.details ? (
            <pre className="error-details">
              {JSON.stringify(error.details, null, 2)}
            </pre>
          ) : null}
        </div>
      ) : null}

      <div className="books-list">
        {loading ? <p className="loading">Cargando...</p> : null}

        {!loading && items.length === 0 ? <p className="empty">No hay resultados.</p> : null}

        {!loading &&
          items.map((b) => (
            <div key={b.id} className="book-card">
              <div className="book-info">
                <div className="book-title">{b.title}</div>
                <div className="book-author">{b.author}</div>
                <div className="book-date">
                  Actualizado: {b.updatedAt}
                </div>
              </div>
              <button onClick={() => onDelete(b.id)} className="btn btn-danger">
                Eliminar
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
