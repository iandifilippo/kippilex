import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get("admin_session")?.value;

  if (adminSession !== "authenticated") {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
