// RUTA: middleware.ts (en la raíz del proyecto)

import { NextResponse, type NextRequest } from 'next/server'
import { createSupabaseMiddlewareClient } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createSupabaseMiddlewareClient(request)
  const { data: { session } } = await supabase.auth.getSession()

  const pathname = request.nextUrl.pathname

  // Rutas públicas (accesibles sin login)
  const publicRoutes = [
    '/', 
    '/signin', 
    '/signup', 
    '/auth/callback', 
    '/reset-password'
  ]
  
  // Rutas de completar perfil (casos especiales)
  const profileCompletionRoutes = [
    '/completar-perfil-abogado', 
    '/completar-perfil-cliente'
  ]

  // Si el usuario NO está logueado
  if (!session) {
    // Si intenta acceder a una ruta protegida, redirige a /signin
    if (!publicRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/signin', request.url))
    }
    // Si está en una ruta pública, déjalo pasar
    return response
  }

  // --- El usuario SÍ está logueado ---

  // Traemos su perfil para saber su 'role' y 'status'
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, status')
    .eq('id', session.user.id)
    .single()

  // Caso 1: Usuario logueado, PERO SIN ROL
  // (Acaba de registrarse con Google y no ha seleccionado rol)
  if (!profile || !profile.role) {
    // Si ya está en la página de seleccionar-rol, déjalo.
    if (pathname === '/seleccionar-rol') {
      return response
    }
    // Si intenta ir a CUALQUIER otra página, fuérzalo a /seleccionar-rol
    return NextResponse.redirect(new URL('/seleccionar-rol', request.url))
  }

  // Caso 2: Usuario logueado, CON ROL, PERO PERFIL INCOMPLETO
  // (Asumo que 'status' es null hasta que llenan el formulario)
  if (profile.role === 'abogado' && profile.status == null) {
    // Si ya está en la página correcta del formulario, déjalo.
    if (pathname === '/completar-perfil-abogado') {
      return response
    }
    // A CUALQUIER otra página, fuérzalo a completar el perfil
    return NextResponse.redirect(new URL('/completar-perfil-abogado', request.url))
  }
  
  if (profile.role === 'cliente' && profile.status == null) {
    if (pathname === '/completar-perfil-cliente') {
      return response
    }
    return NextResponse.redirect(new URL('/completar-perfil-cliente', request.url))
  }
  
  // Caso 3: Usuario logueado, CON ROL Y PERFIL COMPLETO
  // (status es 'pending_verification' o 'active')
  // Si intenta ir a páginas de login/registro/seleccionar-rol, llévalo al dashboard
  if (publicRoutes.includes(pathname) || pathname === '/seleccionar-rol' || profileCompletionRoutes.includes(pathname)) {
     return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Si todo está en orden (logueado, rol, perfil completo y en ruta válida), déjalo pasar
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