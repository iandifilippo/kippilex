// utils/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/cookies';

// Definimos los tipos de las cookies de Next.js para que el compilador no falle
type CookieOptions = {
    domain?: string;
    expires?: Date;
    maxAge?: number;
    path?: string;
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none";
    httpOnly?: boolean;
};

export const createClient = (cookieStore: ReadonlyRequestCookies) => {
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                // La implementación final con los tipos correctos para la compilación
                set(name: string, value: string, options: CookieOptions) {
                    cookieStore.set(name, value, options);
                },
                remove(name: string, options: CookieOptions) {
                    cookieStore.set(name, '', options);
                },
            },
        }
    );
};