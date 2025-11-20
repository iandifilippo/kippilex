import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import VerificationList from "./VerificationList";

export default async function Page() {
  // Protección con cookie
  const cookieStore = await cookies();
  if (cookieStore.get("admin_authed")?.value !== "true") {
    redirect("/admin/login");
  }

  const supabase = await createSupabaseServerClient();

  // Consulta definitiva que FUNCIONA SÍ O SÍ con tu base de datos actual
  const { data: lawyers, error } = await supabase
    .from("profiles")
    .select(`
      id,
      nombre,
      apellido,
      whatsapp,
      ciudad,
      cedula,
      tarjeta_profesional,
      especialidades,
      documento_verificacion_url,
      verification_status
    `)
    .eq("role", "abogado")
    .or("verification_status.eq.pending,verification_status.is.null");

  // Log para que veamos exactamente qué pasa (puedes borrarlo después)
  console.log("ABOGADOS ENCONTRADOS:", lawyers);
  console.log("ERROR SI HAY:", error);

  return <VerificationList lawyers={lawyers || []} />;
}