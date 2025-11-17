import { createSupabaseServerClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // 1. Inicialización y Extracción del Código
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (code) {
    // 💡 CORRECCIÓN CRUCIAL: Añadir 'await' porque createSupabaseServerClient es ahora async
    const supabase = await createSupabaseServerClient(); 
    
    // 2. Intercambio de Código por Sesión
    const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && sessionData.user) {
      // 3. ¡SESIÓN CREADA CON ÉXITO! Ahora verificamos el perfil.
      
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

  // 5. CASO ERROR: Si hay un error de Supabase o no hay código, redirigimos al login.
  console.error('Error en el callback de autenticación.', 'Código no encontrado o error de sesión.');
  return NextResponse.redirect(`${origin}/signin?error=auth_error`);
}