// RUTA: middleware.ts (en la raíz del proyecto)
// ESTADO: CORREGIDO para manejar rutas de ADMIN

import { NextResponse, type NextRequest } from 'next/server'
import { createSupabaseMiddlewareClient } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createSupabaseMiddlewareClient(request)
  const { data: { session } } = await supabase.auth.getSession() // ¡Refresca la sesión aquí!
  const pathname = request.nextUrl.pathname

  // -------------------------------------------------------------
  // 1. LÓGICA ESPECÍFICA PARA ADMINISTRADOR
  // -------------------------------------------------------------
  const isAdminRoute = pathname.startsWith('/admin/dashboard')
  const isAdminLogin = pathname === '/admin/login'

  if (isAdminRoute || isAdminLogin) {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      // Si no está logueado e intenta ir al dashboard, redirigir al login
      if (isAdminRoute) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
      return response // Permite la entrada a /admin/login
    }
    
    // Si está logueado e intenta ir a /admin/login, redirigir al dashboard
    if (isAdminLogin) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
    
    // Si está logueado en el dashboard, se confía en el Server Component para verificar el rol 'admin'
    return response
  }

  // -------------------------------------------------------------
  // 2. LÓGICA GENERAL (USUARIOS NORMALES)
  // -------------------------------------------------------------
  const publicRoutes = ['/', '/casos', '/auth/callback', '/reset-password']
  const authRoutes = ['/signin', '/signup']

  // --- CASO 1: Usuario NO está logueado ---
  if (!session) {
    if (!publicRoutes.includes(pathname) && !authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/signin', request.url))
    }
    return response
  }

  // --- CASO 2: Usuario SÍ está logueado ---
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  // 2a: Usuario logueado, PERO SIN ROL
  if (!profile || !profile.role) {
    if (pathname === '/seleccionar-rol') {
      return response
    }
    return NextResponse.redirect(new URL('/seleccionar-rol', request.url))
  }

  // 2b: Usuario logueado Y CON ROL
  // Si intenta ir a /signin, /signup, o /seleccionar-rol
  if (authRoutes.includes(pathname) || pathname === '/seleccionar-rol') {
     return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return response 
}

export const config = {
  matcher: [
    // Incluye todas las rutas excepto estáticos, imágenes, y favicon.ico
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}