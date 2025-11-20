'use server';

import { createSupabaseServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signOutServer() {
  const supabase = await createSupabaseServerClient();

  await supabase.auth.signOut({ scope: 'global' });

  return redirect('/');
}
