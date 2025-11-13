// components/HeaderConditional.tsx
"use client";

import { usePathname } from 'next/navigation';
import Header from '@/components/ui/header'; 

export default function HeaderConditional() {
  const pathname = usePathname();

  // Limpiamos la ruta para eliminar cualquier barra '/' al final 
  // (ej. '/dashboard/' se convierte en '/dashboard')
  const normalizedPathname = pathname.endsWith('/') && pathname.length > 1
    ? pathname.slice(0, -1)
    : pathname;

  // --- LÓGICA DE VISIBILIDAD FINAL ---
  // Solo mostramos el Header en la página principal ('/')
  const showHeader = normalizedPathname === '/' || normalizedPathname === '';

  if (showHeader) {
    return <Header />;
  }

  // Ocultar el Header en todas las demás rutas (Login, SignUp, Formularios, Dashboards)
  return null;
}