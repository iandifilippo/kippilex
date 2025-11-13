// RUTA: app/auth/callback/route.ts
// ESTADO: CORRECTO (Este archivo está perfecto)

import { createSupabaseServerClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Obtenemos la URL completa y sacamos los parámetros
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  // 'next' es a dónde queremos ir después del login. 
  // Si no se especifica, lo mandamos a /seleccionar-rol
  const next = searchParams.get('next') ?? '/seleccionar-rol';

  if (code) {
    // Usamos el cliente de servidor que ya corregimos
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // ¡ÉXITO! Redirigimos al usuario a la página de seleccionar rol
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Si hay un error o no hay código, redirigimos a una página de error
  console.error('Error en el callback de OAuth:', 'No se pudo intercambiar el código');
  return NextResponse.redirect(`${origin}/signin?error=auth_error`);
}