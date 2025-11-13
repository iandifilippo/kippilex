import { createBrowserClient } from '@supabase/ssr' // Usamos el cliente de navegador
import { NextResponse, type NextRequest } from 'next/server'

// Esta es la ruta para intercambiar el código de Google y establecer la sesión
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (code) {
    // 1. Crear el cliente de navegador EN LÍNEA
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    // 2. INTERCAMBIAR EL CÓDIGO
    await supabase.auth.exchangeCodeForSession(code)
  }

  // 3. Redirigir al seleccionar rol
  return NextResponse.redirect(new URL('/seleccionar-rol', request.url))
}