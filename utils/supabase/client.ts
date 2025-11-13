// --- CÓDIGO CORRECTO PARA: utils/supabase/client.ts ---

import { createBrowserClient } from '@supabase/ssr';

// ¡Importante! Creamos una función 'createClient' que usa el 'createBrowserClient'
// Esto es para que coincida con lo que tus páginas (como 'page.tsx') 
// están importando (import { createClient } from '@/utils/supabase/client')
export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};