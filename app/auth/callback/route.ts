import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server' // Importamos el helper limpio
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const cookieStore = cookies() // Obtenemos la cookie store

    // Usamos la función createClient (que tiene la lógica de cookies limpia)
    const supabase = createClient(cookieStore); 
    
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirigir al seleccionar rol
  return NextResponse.redirect(new URL('/seleccionar-rol', request.url))
}