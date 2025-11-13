// RUTA: middleware.ts (en la raíz del proyecto)
// ESTADO: NUEVO ARCHIVO (Este es el "guardián")

import { NextResponse, type NextRequest } from 'next/server'
import { createSupabaseMiddlewareClient } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createSupabaseMiddlewareClient(request)
  const { data: { session } } = await supabase.auth.getSession()
  const pathname = request.nextUrl.pathname

  // Rutas públicas (accesibles sin login)
  const publicRoutes = ['/', '/casos', '/auth/callback', '/reset-password']
  // Rutas de autenticación
  const authRoutes = ['/signin', '/signup']

  // --- CASO 1: Usuario NO está logueado ---
  if (!session) {
    // Si intenta acceder a una ruta protegida (que no sea pública o de auth)
    if (!publicRoutes.includes(pathname) && !authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/signin', request.url))
    }
    return response // Déjalo pasar
  }

  // --- CASO 2: Usuario SÍ está logueado ---
  const { data: profile } = await supabase
    .from('profiles')
    .select('role') // Leemos su rol
    .eq('id', session.user.id)
    .single()

  // 2a: Usuario logueado, PERO SIN ROL
  if (!profile || !profile.role) {
    if (pathname === '/seleccionar-rol') {
      return response // Déjalo en la página de seleccionar rol
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
  
  return response // Déjalo navegar
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}