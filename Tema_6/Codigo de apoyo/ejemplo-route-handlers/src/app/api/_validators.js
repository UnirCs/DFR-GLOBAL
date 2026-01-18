// app/api/_validators.js
import { HttpError } from "./_http";

export function validateBookCreate(body) {
  const errors = {};

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const author = typeof body.author === "string" ? body.author.trim() : "";

  if (!title) errors.title = "Required";
  if (!author) errors.author = "Required";

  if (Object.keys(errors).length > 0) {
    throw new HttpError(422, "VALIDATION_ERROR", "Validación fallida.", errors);
  }

  return { title, author };
}

export function validateBookPatch(body) {
  const patch = {};
  const errors = {};

  if ("title" in body) {
    if (typeof body.title !== "string" || !body.title.trim()) {
      errors.title = "If provided, must be a non-empty string";
    } else {
      patch.title = body.title.trim();
    }
  }

  if ("author" in body) {
    if (typeof body.author !== "string" || !body.author.trim()) {
      errors.author = "If provided, must be a non-empty string";
    } else {
      patch.author = body.author.trim();
    }
  }

  if (Object.keys(errors).length > 0) {
    throw new HttpError(422, "VALIDATION_ERROR", "Validación fallida.", errors);
  }

  if (Object.keys(patch).length === 0) {
    throw new HttpError(
      400,
      "EMPTY_PATCH",
      "PATCH requiere al menos un campo modificable."
    );
  }

  return patch;
}
