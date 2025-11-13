// RUTA: hooks/useClickOutside.ts
// ESTADO: NUEVO ARCHIVO (Necesario para cerrar el menú)

import { useEffect, RefObject } from 'react';

type Handler = (event: MouseEvent | TouchEvent) => void;

export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: Handler
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref?.current;
      // No hacer nada si el clic es dentro del elemento
      if (!el || el.contains(event.target as Node)) {
        return;
      }
      handler(event); // Clic fuera, ejecutar el handler (cerrar menú)
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}