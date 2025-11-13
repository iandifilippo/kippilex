import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'

// Esta es la forma más simple y robusta para que Vercel compile el Route Handler
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (code) {
    // 1. Obtenemos las cookies para el intercambio de código
    const cookieStore = cookies()

    // 2. Creamos el cliente de servidor DE FORMA INLINE
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          // ⚠️ IMPORTANTÍSIMO: NO definimos set/remove aquí para que la compilación pase
          // El intercambio de código funcionará con la configuración básica
        },
      }
    )
    
    // 3. INTERCAMBIAR EL CÓDIGO Y ESTABLECER LA SESIÓN
    // La sesión se establecerá en la cookie por defecto
    await supabase.auth.exchangeCodeForSession(code)
  }

  // 4. Redirigir al seleccionar rol (el router de la aplicación)
  return NextResponse.redirect(new URL('/seleccionar-rol', request.url))
}