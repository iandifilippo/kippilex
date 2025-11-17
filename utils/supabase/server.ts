import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// 💡 CONVERTIMOS LA FUNCIÓN EN ASÍNCRONA Y AÑADIMOS AWAIT
export const createSupabaseServerClient = async () => { 
  const cookieStore = cookies(); // ¡No necesita 'await' aquí, ya que cookies() no devuelve una Promesa!
                                 // Pero la función en sí debe ser 'async' para el runtime de Next.js.
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return (cookieStore as any).get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            (cookieStore as any).set(name, value, options);
          } catch (error) {
            // Se ignora el error de 'set' en Server Components
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            // CORRECCIÓN CLAVE: Usamos .delete(name) sin 'options'
            (cookieStore as any).delete(name); 
          } catch (error) {
            // Se ignora el error de 'delete' en Server Components
          }
        },
      },
    }
  );
};