// app/api/_http.js
import { NextResponse } from "next/server";

export class HttpError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function getRequestId(request) {
  // Si estás detrás de un proxy/CDN, es habitual que exista un id de traza.
  // Si no, generamos uno simple.
  return (
    request.headers.get("x-request-id") ||
    `${Date.now()}-${Math.random().toString(16).slice(2)}`
  );
}

export async function parseJson(request) {
  try {
    return await request.json();
  } catch {
    throw new HttpError(400, "BAD_JSON", "El cuerpo no es JSON válido.");
  }
}

export function jsonError(err, requestId) {
  if (err instanceof HttpError) {
    return NextResponse.json(
      {
        error: {
          code: err.code,
          message: err.message,
          details: err.details || null,
          requestId,
        },
      },
      { status: err.status }
    );
  }

  // Error inesperado: no filtramos detalles internos al cliente.
  return NextResponse.json(
    {
      error: {
        code: "INTERNAL_ERROR",
        message: "Se ha producido un error inesperado.",
        details: null,
        requestId,
      },
    },
    { status: 500 }
  );
}

export function withErrorHandling(handler) {
  return async function wrapped(request, context) {
    const requestId = getRequestId(request);

    try {
      const res = await handler(request, context);

      // Cabecera útil para correlación en logs/cliente.
      res.headers.set("x-request-id", requestId);
      return res;
    } catch (err) {
      // Registro mínimo; en producción esto iría a un sistema de logs/tracing.
      console.error("API error", { requestId, err });
      const res = jsonError(err, requestId);
      res.headers.set("x-request-id", requestId);
      return res;
    }
  };
}
