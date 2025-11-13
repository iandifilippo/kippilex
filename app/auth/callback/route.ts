import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'

// La ruta GET es asíncrona, pero Next.js maneja el contexto de cookies por nosotros.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (code) {
    // 1. OBTENER LAS COOKIES PARA LA SESIÓN
    const cookieStore = cookies()

    // 2. CREAR EL CLIENTE DIRECTO (para el intercambio de código)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          // Utilizamos la función set/remove directamente en el Route Handler
          set(name: string, value: string, options) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )
    
    // 3. INTERCAMBIAR EL CÓDIGO
    await supabase.auth.exchangeCodeForSession(code)
  }

  // 4. URL a la que redirigir después del login (Seleccionar rol)
  return NextResponse.redirect(new URL('/seleccionar-rol', request.url))
}