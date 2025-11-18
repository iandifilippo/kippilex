// RUTA: middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseMiddlewareClient } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { supabase, response } = createSupabaseMiddlewareClient(request);

  // Refresca sesión ANTES de cualquier lógica
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;

  // -------------------------------------------------------------
  // 1. RUTAS DE ADMIN
  // -------------------------------------------------------------
  const isAdminDashboard = pathname.startsWith("/admin/dashboard");
  const isAdminLogin = pathname === "/admin/login";

  if (isAdminDashboard || isAdminLogin) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      if (isAdminDashboard) {
        url.pathname = "/admin/login";
        return NextResponse.redirect(url);
      }
      return response; // login público
    }

    if (isAdminLogin) {
      url.pathname = "/admin/dashboard";
      return NextResponse.redirect(url);
    }

    return response;
  }

  // -------------------------------------------------------------
  // 2. USUARIOS NORMALES
  // -------------------------------------------------------------
  const publicRoutes = ["/", "/casos", "/auth/callback", "/reset-password"];
  const authRoutes = ["/signin", "/signup"];

  // Usuario NO logueado
  if (!session) {
    if (!publicRoutes.includes(pathname) && !authRoutes.includes(pathname)) {
      url.pathname = "/signin";
      return NextResponse.redirect(url);
    }
    return response;
  }

  // Usuario logueado — obtener perfil
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  // Sin rol aún
  if (!profile || !profile.role) {
    if (pathname === "/seleccionar-rol") return response;

    url.pathname = "/seleccionar-rol";
    return NextResponse.redirect(url);
  }

  // Logueado y con rol — evitar volver a rutas públicas
  if (authRoutes.includes(pathname) || pathname === "/seleccionar-rol") {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
