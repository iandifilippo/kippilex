'use client';

import React from 'react';
// Asumiendo que este archivo está en 'components/ui/'
// y tu acción está en 'app/auth/'
import { signOutServer } from '../../app/auth/actions';

// Definimos los props que puede recibir el componente
interface SignOutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Este componente renderiza un botón dentro de un formulario para
 * llamar de forma segura a la Server Action de "Cerrar Sesión".
 * La acción se encarga de la lógica del servidor y de la redirección.
 */
export const SignOutButton = ({ className, children }: SignOutButtonProps) => {
  return (
    <form action={signOutServer} className="w-full">
      <button
        type="submit"
        // Si pasas una clase, la usa. Si no, usa una por defecto.
        className={
          className ||
          'flex items-center w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-md'
        }
      >
        {/* Si pasas 'children' (ej. un ícono + texto), los renderiza.
            Si no, usa el texto por defecto. */}
        {children || 'Cerrar Sesión'}
      </button>
    </form>
  );
};

export default SignOutButton;