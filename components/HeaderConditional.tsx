// RUTA: components/HeaderConditional.tsx
// ESTADO: CORREGIDO (Muestra el header en /casos)

"use client";

import { usePathname } from 'next/navigation';
import Header from '@/components/ui/header'; 

export default function HeaderConditional() {
  const pathname = usePathname();

  const normalizedPathname = pathname.endsWith('/') && pathname.length > 1
    ? pathname.slice(0, -1)
    : pathname;

  // --- LÓGICA DE VISIBILIDAD CORREGIDA ---
  
  // 1. Definimos las rutas donde NO queremos ver el header
  const hiddenRoutes = [
    '/signin',
    '/signup',
    '/seleccionar-rol',
    '/completar-perfil-abogado',
    '/completar-perfil-cliente',
    '/reset-password'
  ];

  if (hiddenRoutes.includes(normalizedPathname)) {
    return null; // Ocultar en estas páginas
  }
  
  // 2. Si no está en la lista de ocultas, LO MOSTRAMOS
  // Esto mostrará el header en '/', '/dashboard', '/casos', etc.
  return <Header />;
}