// RUTA: components/HeaderConditional.tsx
// ESTADO: CORREGIDO

"use client";

import { usePathname } from 'next/navigation';
import Header from '@/components/ui/header'; 

export default function HeaderConditional() {
  const pathname = usePathname();

  const normalizedPathname = pathname.endsWith('/') && pathname.length > 1
    ? pathname.slice(0, -1)
    : pathname;

  // --- LÓGICA DE VISIBILIDAD CORREGIDA ---
  
  // 1. Definimos las rutas donde SÍ queremos ver el header
  const visibleRoutes = [
    '/', // La página de inicio
    '/dashboard' // El dashboard (y cualquier sub-ruta como /dashboard/settings)
  ];

  // 2. Definimos las rutas donde NO queremos ver el header
  const hiddenRoutes = [
    '/signin',
    '/signup',
    '/seleccionar-rol',
    '/completar-perfil-abogado',
    '/completar-perfil-cliente',
    '/reset-password'
  ];

  // 3. Comprobamos si la ruta actual está en la lista de ocultas
  if (hiddenRoutes.includes(normalizedPathname)) {
    return null; // Ocultar
  }
  
  // 4. Comprobamos si la ruta actual COMIENZA con alguna de las rutas visibles
  // (Esto permite que '/dashboard/settings' también muestre el header)
  const showHeader = visibleRoutes.some(route => normalizedPathname.startsWith(route));

  if (showHeader) {
    return <Header />;
  }

  // Por defecto (para cualquier otra ruta no definida), no mostramos el header
  return null;
}