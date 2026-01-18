// app/api/cinemas/route.js (Route Handler)
import { listCinemas, createCinema } from "@/src/lib/cinemas-store";

export async function GET() {
  const cinemas = await listCinemas();
  return Response.json(cinemas, { status: 200 });
}

export async function POST(request) {
  const body = await request.json();

  if (!body || typeof body.name !== "string" || body.name.trim() === "") {
    return Response.json(
      { error: "Field 'name' is required" },
      { status: 400 }
    );
  }

  const created = await createCinema({ name: body.name.trim() });
  return Response.json(created, { status: 201 });
}
