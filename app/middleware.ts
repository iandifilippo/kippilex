// RUTA: middleware.ts (en la raíz del proyecto)
// ESTADO: NUEVO ARCHIVO (Este es el "guardián" que arregla tu lógica)

import { NextResponse, type NextRequest } from 'next/server'
import { createSupabaseMiddlewareClient } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createSupabaseMiddlewareClient(request)
  
  // Refresca la sesión (importante)
  const { data: { session } } = await supabase.auth.getSession()

  const pathname = request.nextUrl.pathname

  // Rutas públicas que todos pueden ver
  const publicRoutes = ['/', '/casos', '/auth/callback', '/reset-password']

  // Rutas de autenticación
  const authRoutes = ['/signin', '/signup']

  // --- CASO 1: Usuario NO está logueado ---
  if (!session) {
    // Si intenta acceder a una ruta protegida (como /dashboard)
    if (!publicRoutes.includes(pathname) && !authRoutes.includes(pathname)) {
      // Lo mandamos a iniciar sesión
      return NextResponse.redirect(new URL('/signin', request.url))
    }
    // Si está en una ruta pública o de auth, déjalo pasar
    return response
  }

  // --- CASO 2: Usuario SÍ está logueado ---
  
  // Leemos su perfil para saber su 'role'
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  // 2a: Usuario logueado, PERO SIN ROL
  // (Acaba de registrarse y no ha seleccionado)
  if (!profile || !profile.role) {
    // Si ya está en la página de seleccionar-rol, déjalo.
    if (pathname === '/seleccionar-rol') {
      return response
    }
    // A CUALQUIER otra página, fuérzalo a /seleccionar-rol
    return NextResponse.redirect(new URL('/seleccionar-rol', request.url))
  }

  // 2b: Usuario logueado Y CON ROL
  // Si intenta ir a /signin, /signup, o /seleccionar-rol
  if (authRoutes.includes(pathname) || pathname === '/seleccionar-rol') {
    // Lo mandamos directo al dashboard (¡Esto arregla tu bug!)
     return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Si todo está bien, déjalo navegar
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}