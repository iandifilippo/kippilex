// app/admin/layout.tsx
// ESTADO: CORREGIDO (Solo contenedor de interfaz de usuario)

import React from 'react';
// ELIMINAMOS: import { cookies } from 'next/headers';
// ELIMINAMOS: import { redirect } from 'next/navigation'; 

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    // ELIMINAMOS LA LÓGICA DE VERIFICACIÓN DE COOKIES Y REDIRECCIÓN:
    // const cookieStore = cookies() as any;
    // const adminSession = cookieStore.get('admin_session')?.value;
    // if (adminSession !== 'authenticated') { redirect('/admin/login'); }

    // El layout simplemente renderiza sus hijos. La protección se hace a nivel de página.
    return (
        <div className="admin-container">
            {children}
        </div>
    );
}