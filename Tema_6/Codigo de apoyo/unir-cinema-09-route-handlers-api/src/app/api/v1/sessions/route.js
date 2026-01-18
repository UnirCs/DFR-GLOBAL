import { NextResponse } from "next/server";
import store from "../_store";

// Usuarios válidos para autenticación
const VALID_USERS = [
  { username: "admin", password: "admin123", role: "admin", name: "Administrador" },
  { username: "user", password: "user123", role: "user", name: "Usuario" }
];

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // Buscar usuario válido
    const user = VALID_USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // Devolver datos del usuario (sin password)
    return NextResponse.json({
      username: user.username,
      name: user.name,
      role: user.role,
      token: `fake-jwt-token-${Date.now()}`
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error en el servidor de autenticación" },
      { status: 500 }
    );
  }
}
