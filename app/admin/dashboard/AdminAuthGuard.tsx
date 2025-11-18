import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  
  const cookieStore = cookies();
  
  // CORRECCIÓN CLAVE: Aplica el casting 'as any' aquí también, o en la llamada a cookies().
  // La forma más limpia es castear el resultado de cookies() si es necesario.
  // Pero en Next.js a veces es suficiente con el componente 'async'. 
  // Intentaremos la solución más robusta:
  const adminSession = (cookieStore as any).get('admin_session')?.value;

  if (adminSession !== 'authenticated') {
    redirect('/admin/login');
  }

  return <>{children}</>;
}