"use server";

import { createSupabaseServerClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function verifyLawyer(lawyerId: string, status: 'verified' | 'rejected') {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from('profiles')
    .update({ verification_status: status === 'verified' ? 'verified' : 'rejected' })
    .eq('id', lawyerId);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/dashboard');
  revalidatePath('/dashboard');

  return { success: true, message: status === 'verified' ? 'Abogado aprobado' : 'Abogado rechazado' };
}