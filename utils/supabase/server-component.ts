// RUTA: utils/supabase/server-component.ts (¡El código corregido!)

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// 1. AÑADIR ASYNC
export const createSupabaseServerComponentClient = async () => { 
  // 2. AÑADIR AWAIT
  const cookieStore = await cookies() 

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: async (name: string) => {
          return cookieStore.get(name)?.value // ¡Ahora funciona!
        },
        // Al estar vacías, estas funciones no "modifican" nada
        // y evitan el error de Next.js.
        set: async (name: string, value: string, options: CookieOptions) => {
          // No hacer nada
        },
        remove: async (name: string, options: CookieOptions) => {
          // No hacer nada
        },
      },
    }
  )
}