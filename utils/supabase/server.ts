import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        // --- ¡AQUÍ ESTÁ LA CORRECCIÓN! ---
        // (Sin llaves '{' ni '...options')
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set(name, value, options)
        },
        // --- Y AQUÍ ---
        remove(name: string, options: CookieOptions) {
          cookieStore.set(name, '', options)
        },
      },
    }
  )
}