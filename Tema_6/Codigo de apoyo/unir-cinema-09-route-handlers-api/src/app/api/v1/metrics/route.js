import { NextResponse } from "next/server";
import store from "../_store";

export async function GET() {
  const metrics = store.get("metrics") || {};

  // Actualizar el timestamp cada vez que se consultan las métricas
  const updatedMetrics = {
    ...metrics,
    updatedAt: new Date().toISOString()
  };

  return NextResponse.json(updatedMetrics);
}
