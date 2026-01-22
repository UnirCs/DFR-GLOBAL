import { NextResponse } from "next/server";
import { findUserByUsername } from "../_store";


export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // Buscar usuario en la base de datos
    const user = await findUserByUsername(username);

    if (!user) {
      return NextResponse.json(
        { error: "Credenciales invalidas" },
        { status: 401 }
      );
    }

    // Verificar password (en produccion usar bcrypt.compare)
    // Por ahora comparamos directamente con password_hash
    if (user.password_hash !== password) {
      return NextResponse.json(
        { error: "Credenciales invalidas" },
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
      { error: "Error en el servidor de autenticacion" },
      { status: 500 }
    );
  }
}
