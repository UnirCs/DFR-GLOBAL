// src/lib/apiClient.js
export class ApiError extends Error {
  constructor(message, { status, code, details, requestId }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
    this.requestId = requestId;
  }
}

async function safeParseJson(response) {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return null;

  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function apiFetch(path, { method = "GET", body, headers, cache } = {}) {
  const init = {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : null),
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache, // en navegador aplica a la caché HTTP del user agent
  };

  const response = await fetch(path, init);

  // Caso 204: éxito sin cuerpo. El cliente devuelve null como data.
  if (response.status === 204) {
    if (!response.ok) {
      throw new ApiError("Respuesta 204 inesperada en un estado no exitoso.", {
        status: response.status,
        code: "UNEXPECTED_204",
        details: null,
        requestId: response.headers.get("x-request-id") || null,
      });
    }
    return { data: null, status: 204, requestId: response.headers.get("x-request-id") || null };
  }

  const payload = await safeParseJson(response);
  const requestId = response.headers.get("x-request-id") || payload?.error?.requestId || null;

  if (!response.ok) {
    const serverError = payload?.error;
    throw new ApiError(serverError?.message || "Error de API.", {
      status: response.status,
      code: serverError?.code || "UNKNOWN_ERROR",
      details: serverError?.details || null,
      requestId,
    });
  }

  return { data: payload, status: response.status, requestId };
}
