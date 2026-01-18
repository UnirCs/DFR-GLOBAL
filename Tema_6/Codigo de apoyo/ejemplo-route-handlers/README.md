# Ejemplo de Route Handlers en Next.js

Este es un proyecto de ejemplo que demuestra el uso de **Route Handlers** en Next.js App Router para crear una API RESTful de gestión de libros.

## ¿Qué son los Route Handlers?

Los **Route Handlers** son la forma de crear endpoints de API en Next.js cuando usamos el App Router. Permiten manejar peticiones HTTP (GET, POST, PUT, PATCH, DELETE, etc.) directamente en el servidor, sin necesidad de un servidor externo.

### Características principales:

- Se definen en archivos `route.js` o `route.ts` dentro de la carpeta `app/`
- Pueden coexistir con las páginas, pero deben estar en la carpeta `api/` o en rutas que no tengan un `page.js` en el mismo nivel
- Soportan todos los métodos HTTP estándar
- Tienen acceso a las APIs de Request y Response de Web Standards
- Se ejecutan en el servidor (Server-Side)

### ¿Dónde pueden usarse?

Los Route Handlers se ubican dentro de `app/api/` siguiendo la convención de rutas:

```
app/
├── api/
│   ├── route.js          → /api
│   └── books/
│       ├── route.js      → /api/books
│       └── [id]/
│           └── route.js  → /api/books/:id
```

---

## Estructura del Proyecto

```
src/
├── app/
│   ├── api/
│   │   ├── _http.js          # Utilidades HTTP (manejo de errores, parsing JSON)
│   │   ├── _store.js         # Almacén de datos en memoria
│   │   ├── _validators.js    # Validadores de entrada
│   │   └── books/
│   │       ├── route.js      # GET /api/books, POST /api/books
│   │       └── [id]/
│   │           └── route.js  # GET, PUT, PATCH, DELETE /api/books/:id
│   └── books/
│       ├── page.js           # Página del cliente
│       └── BooksClient.js    # Componente cliente
└── lib/
    └── apiClient.js          # Cliente para consumir la API
```

> **Nota**: Los archivos que comienzan con `_` (como `_http.js`, `_store.js`, `_validators.js`) son módulos auxiliares privados y **no** se exponen como endpoints.

---

## Route Handlers Implementados

### 1. `/api/books` - Colección de Libros

📁 **Archivo:** `src/app/api/books/route.js`

#### `GET /api/books`

Obtiene la lista de todos los libros. Soporta búsqueda opcional.

| Parámetro Query | Tipo   | Descripción                            |
|-----------------|--------|----------------------------------------|
| `q`             | string | Filtra por título o autor (opcional)   |

**Respuesta exitosa (200):**
```json
{
  "data": [
    {
      "id": "1",
      "title": "El Quijote",
      "author": "Cervantes",
      "createdAt": "2024-01-14T10:00:00.000Z",
      "updatedAt": "2024-01-14T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### `POST /api/books`

Crea un nuevo libro.

**Body requerido:**
```json
{
  "title": "El Quijote",
  "author": "Cervantes"
}
```

**Respuesta exitosa (201):**
```json
{
  "data": {
    "id": "1",
    "title": "El Quijote",
    "author": "Cervantes",
    "createdAt": "2024-01-14T10:00:00.000Z",
    "updatedAt": "2024-01-14T10:00:00.000Z"
  }
}
```

**Errores posibles:**
- `422 VALIDATION_ERROR`: Campos `title` o `author` faltantes
- `409 DUPLICATE_TITLE`: Ya existe un libro con ese título

---

### 2. `/api/books/[id]` - Libro Individual

📁 **Archivo:** `src/app/api/books/[id]/route.js`

Este archivo utiliza **rutas dinámicas** mediante el segmento `[id]`, que permite capturar el identificador del libro desde la URL.

#### `GET /api/books/:id`

Obtiene un libro específico por su ID.

**Respuesta exitosa (200):**
```json
{
  "data": {
    "id": "1",
    "title": "El Quijote",
    "author": "Cervantes",
    "createdAt": "2024-01-14T10:00:00.000Z",
    "updatedAt": "2024-01-14T10:00:00.000Z"
  }
}
```

**Errores posibles:**
- `404 NOT_FOUND`: No existe el libro con ese ID

#### `PUT /api/books/:id`

Reemplaza completamente un libro existente.

**Body requerido:**
```json
{
  "title": "Nuevo título",
  "author": "Nuevo autor"
}
```

**Respuesta exitosa (200):** Devuelve el libro actualizado.

#### `PATCH /api/books/:id`

Actualiza parcialmente un libro (solo los campos proporcionados).

**Body (al menos un campo):**
```json
{
  "title": "Título modificado"
}
```

**Respuesta exitosa (200):** Devuelve el libro actualizado.

**Errores posibles:**
- `400 EMPTY_PATCH`: No se proporcionó ningún campo para modificar
- `422 VALIDATION_ERROR`: Los campos proporcionados no son válidos

#### `DELETE /api/books/:id`

Elimina un libro por su ID.

**Respuesta exitosa:** `204 No Content` (sin cuerpo)

**Errores posibles:**
- `404 NOT_FOUND`: No existe el libro con ese ID

---

## Utilidades del Proyecto

### Manejo de Errores (`_http.js`)

El proyecto implementa un sistema robusto de manejo de errores:

- **`HttpError`**: Clase personalizada para errores HTTP con código, estado y detalles
- **`withErrorHandling`**: Wrapper HOF que captura errores y los formatea automáticamente
- **`parseJson`**: Parser seguro de JSON con manejo de errores
- **`jsonError`**: Genera respuestas de error consistentes

### Formato de Error Estándar

Todas las respuestas de error siguen este formato:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validación fallida.",
    "details": { "title": "Required" },
    "requestId": "1705234567890-a1b2c3"
  }
}
```

### Validación (`_validators.js`)

- **`validateBookCreate`**: Valida la creación de libros (requiere `title` y `author`)
- **`validateBookPatch`**: Valida actualizaciones parciales

### Almacén de Datos (`_store.js`)

Simula una base de datos en memoria con operaciones CRUD básicas:

- `listBooks()`: Lista todos los libros
- `getBook(id)`: Obtiene un libro por ID
- `createBook(data)`: Crea un nuevo libro
- `replaceBook(id, data)`: Reemplaza un libro (PUT)
- `patchBook(id, patch)`: Actualiza parcialmente (PATCH)
- `deleteBook(id)`: Elimina un libro

---

## Cliente de API (`apiClient.js`)

El proyecto incluye un cliente para consumir la API desde el frontend:

```javascript
import { apiFetch, ApiError } from '@/lib/apiClient';

// Ejemplo de uso
try {
  const { data } = await apiFetch('/api/books', {
    method: 'POST',
    body: { title: 'Nuevo libro', author: 'Autor' }
  });
  console.log(data);
} catch (error) {
  if (error instanceof ApiError) {
    console.error(error.code, error.message);
  }
}
```

---

## Getting Started

Primero, ejecuta el servidor de desarrollo:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

### Probar la API

Puedes probar los endpoints usando `curl` o herramientas como Postman:

```bash
# Listar libros
curl http://localhost:3000/api/books

# Crear un libro
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title": "El Quijote", "author": "Cervantes"}'

# Obtener un libro
curl http://localhost:3000/api/books/1

# Actualizar parcialmente
curl -X PATCH http://localhost:3000/api/books/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Don Quijote de la Mancha"}'

# Eliminar un libro
curl -X DELETE http://localhost:3000/api/books/1
```

---

## Learn More

Para aprender más sobre Route Handlers en Next.js:

- [Route Handlers Documentation](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) - Documentación oficial
- [Next.js Documentation](https://nextjs.org/docs) - Características y API de Next.js
- [Learn Next.js](https://nextjs.org/learn) - Tutorial interactivo de Next.js

---

## Deploy on Vercel

La forma más sencilla de desplegar tu aplicación Next.js es usando la [Plataforma Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Consulta la [documentación de despliegue de Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para más detalles.
