import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId, password } = await req.json();

  // Validación con variables env
  if (
    userId !== process.env.ADMIN_USER ||
    password !== process.env.ADMIN_PASS
  ) {
    return NextResponse.json(
      { message: "Credenciales inválidas" },
      { status: 401 }
    );
  }

  // 🔥 Crear respuesta
  const response = NextResponse.json(
    { message: "Autenticado" },
    { status: 200 }
  );

  // 🔥 Crear cookie HTTP only válida para todo /admin/*
  response.cookies.set({
    name: "admin_session",
    value: "authenticated",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 horas
  });

  return response;
}
