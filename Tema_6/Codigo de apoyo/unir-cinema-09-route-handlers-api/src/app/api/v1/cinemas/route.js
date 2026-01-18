import { NextResponse } from "next/server";
import store from "../_store";

export async function GET() {
  const cinemas = store.get("cinemas") || [];
  return NextResponse.json(cinemas);
}
