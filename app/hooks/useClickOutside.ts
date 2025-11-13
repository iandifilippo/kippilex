// RUTA: app/hooks/useClickOutside.ts
// ESTADO: NUEVO (Asegúrate de que este archivo exista)

import { useEffect, RefObject } from 'react';

type Event = MouseEvent | TouchEvent;

export const useClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: Event) => void
) => {
  useEffect(() => {
    const listener = (event: Event) => {
      const el = ref?.current;
      // Si el ref no existe o el clic fue DENTRO del ref, no hagas nada
      if (!el || el.contains((event?.target as Node) || null)) {
        return;
      }
      // Si el clic fue AFUERA, ejecuta el handler
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

export default useClickOutside;