'use server'; // Asegúrate de que esto esté al inicio

import { createSupabaseServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation"; // ¡IMPORTANTE!

export async function signOutServer() {
  // 💡 CORRECCIÓN: Ahora necesitamos 'await'
  const supabase = await createSupabaseServerClient(); 
  
  // El await es crucial para que Supabase limpie las cookies ANTES de redirigir.
  await supabase.auth.signOut({ scope: 'global' });
  
  redirect('/'); 
}