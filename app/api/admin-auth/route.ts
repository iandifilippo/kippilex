import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log('ADMIN_ENV_EXISTS:', !!process.env.ADMIN_USER, !!process.env.ADMIN_PASS);
    console.log('BODY_RECEIVED:', JSON.stringify({ userId: body?.userId ? '***' : null }));

    const userId = body?.userId;
    const password = body?.password;

    if (!userId || !password) {
      return NextResponse.json({ message: "Body inválido" }, { status: 400 });
    }

    if (userId !== process.env.ADMIN_USER || password !== process.env.ADMIN_PASS) {
      console.log('AUTH_FAIL: provided does not match env');
      return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 });
    }

    const response = NextResponse.json({ message: "Autenticado" }, { status: 200 });
    response.cookies.set({
      name: "admin_session",
      value: "authenticated",
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 12,
    });

    console.log('AUTH_OK -> cookie set');
    return response;
  } catch (err) {
    console.error('ADMIN_AUTH_ERROR', err);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}
