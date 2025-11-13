// RUTA: middleware.ts (en la raíz del proyecto)
// ESTADO: NUEVO ARCHIVO (Arregla el bug de redirección de roles)

import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseMiddlewareClient } from '@/utils/supabase/middleware'; // Crearemos este archivo
import type { Session } from '@supabase/supabase-js';

// Rutas públicas que no requieren login
const publicRoutes = ['/', '/signin', '/signup', '/auth/callback', '/casos'];

// Rutas de registro que un usuario logueado NO debe ver
const registrationRoutes = ['/signin', '/signup', '/seleccionar-rol'];

const isProfileComplete = (profile: any): boolean => {
  // Define qué significa "completo"
  // Por ahora, solo checamos que el nombre no esté vacío.
  return profile && profile.nombre && profile.nombre !== '';
};

export async function middleware(request: NextRequest) {
  const { supabase, response } = createSupabaseMiddlewareClient(request);
  const { data: { session } } = await supabase.auth.getSession();
  const pathname = request.nextUrl.pathname;

  // --- CASO 1: Usuario NO está logueado ---
  if (!session) {
    // Si intenta acceder a una ruta protegida (que no sea pública)
    if (!publicRoutes.includes(pathname) && !pathname.startsWith('/dashboard')) {
      // Lo mandamos a la página de inicio
      return NextResponse.redirect(new URL('/', request.url));
    }
    return response; // Déjalo pasar (a /, /signin, etc.)
  }

  // --- CASO 2: Usuario SÍ está logueado ---
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, nombre') // Traemos el rol y el nombre
    .eq('id', session.user.id)
    .single();

  // 2a: Usuario logueado, PERO SIN ROL
  if (!profile || !profile.role) {
    // Si ya está en la página de seleccionar-rol, déjalo.
    if (pathname === '/seleccionar-rol') {
      return response;
    }
    // A CUALQUIER otra página, fuérzalo a /seleccionar-rol
    return NextResponse.redirect(new URL('/seleccionar-rol', request.url));
  }

  // 2b: Usuario logueado, CON ROL, PERO PERFIL INCOMPLETO
  if (!isProfileComplete(profile)) {
    const completeProfilePath = profile.role === 'abogado' 
      ? '/completar-perfil-abogado' 
      : '/completar-perfil-cliente';
      
    if (pathname !== completeProfilePath) {
      return NextResponse.redirect(new URL(completeProfilePath, request.url));
    }
  }

  // 2c: Usuario logueado, CON ROL Y PERFIL COMPLETO
  // Si intenta ir a /signin, /signup, o /seleccionar-rol, llévalo al dashboard
  if (registrationRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Si está logueado, con rol y perfil, déjalo navegar
  return response;
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
};