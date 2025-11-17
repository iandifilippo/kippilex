import { createSupabaseServerClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // 1. Inicialización y Extracción del Código
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (code) {
    const supabase = await createSupabaseServerClient(); 
    
    // 2. Intercambio de Código por Sesión
    const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code);

    // MANEJO DE ERROR (Líneas 17-20)
    if (error) { // Si hay un error de Supabase
      // El error existe y puede tener un mensaje.
      console.error("Supabase Auth Error en Callback:", error.message);
      return NextResponse.redirect(`${origin}/signin?error=${encodeURIComponent(error.message)}`);
    }

    // MANEJO DE ÉXITO (Línea 22 en adelante)
    if (sessionData && sessionData.user) { // Si NO hubo error Y hay datos de sesión/usuario
      // user NO es 'null' dentro de este bloque
      const user = sessionData.user; 

      // Consultamos la tabla 'profiles' para ver si ya tiene un rol asignado.
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile && profile.role) {
        // 4A. CASO ÉXITO: El usuario ya tiene un rol. Lo mandamos al dashboard.
        return NextResponse.redirect(`${origin}/dashboard`);
      } else {
        // 4B. CASO NECESARIO: Es un usuario nuevo o le falta el rol. Lo mandamos a seleccionar rol.
        return NextResponse.redirect(`${origin}/seleccionar-rol`);
      }
    }
  }

  // 5. CASO FALLO FINAL: Si el 'code' no existía o si el proceso falló de forma inesperada (p. ej., sessionData.user era null)
  console.error('Error en el callback de autenticación.', 'Código no encontrado o error de sesión.');
  return NextResponse.redirect(`${origin}/signin?error=auth_error`);
}