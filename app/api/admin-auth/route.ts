import { NextResponse } from "next/server";

const ADMIN_USER = "admin1@kippilex.co";   // ← lo que tengas
const ADMIN_PASS = "kippisito";   // ← lo que tengas

export async function POST(request: Request) {
  const { userId, password } = await request.json();

  if (userId === ADMIN_USER && password === ADMIN_PASS) {
    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_authed", "true", {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  }

  return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 });
}