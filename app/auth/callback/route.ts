import { createSupabaseServerClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // 1. Inicialización y Extracción del Código
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  // URL de Redirección de Fallo (se usa si 'code' falta o si la sesión falla)
  const defaultErrorRedirect = NextResponse.redirect(`${origin}/signin?error=auth_error`);

  if (!code) {
    console.error('Error en el callback de autenticación: Código no encontrado.');
    return defaultErrorRedirect;
  }

  const supabase = await createSupabaseServerClient(); 
  
  // 2. Intercambio de Código por Sesión
  const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code);

  // MANEJO DE ERROR (Supabase)
  if (error) { 
    console.error("Supabase Auth Error en Callback:", error.message);
    // Usamos el mismo redirect pero con el mensaje específico
    return NextResponse.redirect(`${origin}/signin?error=${encodeURIComponent(error.message)}`);
  }

  // 3. MANEJO DE ÉXITO y Tipado: Aseguramos que 'user' exista antes de continuar
  const user = sessionData?.user;
  
  if (!user) {
    console.error('Error en el callback de autenticación: Sesión o usuario nulo después del intercambio.');
    return defaultErrorRedirect;
  }

  // 4. Consultamos el perfil para determinar la ruta
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role) {
    // 4A. CASO ÉXITO: Usuario con rol existente.
    return NextResponse.redirect(`${origin}/dashboard`);
  } else {
    // 4B. CASO NECESARIO: Usuario nuevo o sin rol.
    return NextResponse.redirect(`${origin}/seleccionar-rol`);
  }
}
// El archivo debe terminar AQUÍ. No debe haber ninguna línea o carácter después de esta llave.