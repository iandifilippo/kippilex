import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // 1. Inicializar la respuesta
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 2. Crear el cliente de Supabase para el Middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // 3. Obtener el usuario
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 4. Lógica de Protección de Rutas
  const url = request.nextUrl.clone();
  const path = url.pathname;

  // CASO A: Usuario Logueado intentando ir al Home o Login/Registro
  if (user) {
    // Si intenta ir al root "/" o a las páginas de auth, lo mandamos al dashboard
    if (path === "/" || path.startsWith("/signin") || path.startsWith("/signup")) {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  // CASO B: Usuario NO Logueado intentando ir al Dashboard
  if (!user && path.startsWith("/dashboard")) {
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ (public images folders)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};