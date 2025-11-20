// middleware.ts
import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Solo proteger zona /admin (excepto /admin/login)
  if (!url.pathname.startsWith("/admin")) return NextResponse.next();
  if (url.pathname === "/admin/login") return NextResponse.next();

  // Leer cookie segura creada al loguear al admin
  const session = req.cookies.get("admin_session")?.value;

  if (session !== "authenticated") {
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
