// actions/admin.ts

"use server";

import { createSupabaseServerClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// AHORA ACEPTA DOS ARGUMENTOS: lawyerId y status
export async function verifyLawyer(lawyerId: string, status: 'verified' | 'rejected') {
    const supabase = await createSupabaseServerClient();

    // 1. Verificar la autenticación del usuario que ejecuta esta acción (Opcional, pero recomendado)
    const { data: { user } } = await supabase.auth.getUser();
    // Aquí puedes añadir la comprobación de rol 'admin' si es necesario.

    // 2. Actualizar el estado del perfil
    const { error } = await supabase
        .from("profiles")
        // USA EL PARÁMETRO 'status' para aprobar o rechazar
        .update({ verification_status: status })
        .eq("id", lawyerId);

    if (error) {
        console.error("Error al actualizar estado del abogado:", error);
        return { success: false, message: error.message };
    }

    // 3. Forzar el refresco de las rutas afectadas
    revalidatePath("/admin/dashboard"); // Para que desaparezca de la lista de pendientes
    revalidatePath("/dashboard"); // Para que el abogado vea el cambio de estado

    return { success: true, message: `Abogado actualizado a estado: ${status}.` };
}