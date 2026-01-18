import { NextResponse } from "next/server";
import { findUserByUsername } from "../_store";

export const runtime = "nodejs";

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

    // Datos del usuario para la respuesta y la cookie
    const userData = {
      username: user.username,
      name: user.name,
      role: user.role,
      token: `fake-jwt-token-${Date.now()}`
    };

    // Crear la respuesta con los datos del usuario
    const response = NextResponse.json(userData);

    // Establecer cookie de sesion para el proxy
    // La cookie contiene los datos del usuario serializados en JSON
    response.cookies.set('unir-cinema-session', JSON.stringify(userData), {
      httpOnly: false, // false para poder leerla desde el cliente y sincronizar el contexto
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 horas
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Error en el servidor de autenticacion" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/sessions - Cerrar sesion (logout)
 *
 * Elimina la cookie de sesion para cerrar la sesion del usuario.
 * El proxy dejara de reconocer al usuario como autenticado.
 */
export async function DELETE() {
  const response = NextResponse.json({ message: "Sesion cerrada correctamente" });

  // Eliminar la cookie de sesion
  response.cookies.set('unir-cinema-session', '', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0 // Expira inmediatamente
  });

  return response;
}
