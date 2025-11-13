// --- CÓDIGO FINAL Y DEFINITIVO PARA VERCEL ---

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'

// La ruta GET es asíncrona
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (code) {
    // 1. OBTENER LAS COOKIES ASÍNCRONAMENTE (PARA SATISFACER AL COMPILADOR DE VERCEL)
    const cookieStore = cookies()

    // 2. CREAR EL CLIENTE DE SERVIDOR (INLINE)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          // El get debe ser una función asíncrona para que no marque el error de "Promise"
          async get(name: string) {
            return cookieStore.get(name)?.value
          },
          // Dejamos el set y remove vacíos, el intercambio de código no los necesita para GET
        },
      }
    )
    
    // 3. INTERCAMBIAR EL CÓDIGO
    await supabase.auth.exchangeCodeForSession(code)
  }

  // 4. Redirigir al seleccionar rol
  return NextResponse.redirect(new URL('/seleccionar-rol', request.url))
}