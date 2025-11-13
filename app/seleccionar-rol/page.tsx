// RUTA: app/seleccionar-rol/page.tsx
// ESTADO: CORREGIDO (Usa 'upsert' para crear el perfil y guardar datos de Google)

"use client";

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function SeleccionarRol() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false); 
  const [errorMsg, setErrorMsg] = useState('');

  const handleRoleSelection = async (role: 'abogado' | 'cliente') => {
    setLoading(true);
    setErrorMsg('');

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      setErrorMsg('No pudimos verificar tu sesión. Por favor, intenta ingresar de nuevo.');
      setLoading(false);
      router.push('/signin');
      return;
    }

    // --- CORRECCIÓN CLAVE: UPSERT ---
    // Esto CREA el perfil si no existe y guarda el ROL.
    // También guarda los datos de Google (nombre, avatar)
    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id, // El ID del usuario de auth
        role: role,  // El rol seleccionado
        // Guardamos los datos de Google para usarlos en "Mi Perfil"
        nombre: user.user_metadata.full_name?.split(' ')[0] || user.user_metadata.name || '',
        apellido: user.user_metadata.full_name?.split(' ').slice(1).join(' ') || '',
        avatar_url: user.user_metadata.avatar_url,
      });

    if (upsertError) {
      setErrorMsg('Hubo un error al guardar tu elección. Por favor, intenta de nuevo.');
      console.error(upsertError);
      setLoading(false);
    } else {
      // Redirección exitosa
      if (role === 'abogado') {
        window.location.href = '/completar-perfil-abogado';
      } else {
        window.location.href = '/completar-perfil-cliente'; 
      }
    }
  };

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          <div className="mx-auto max-w-3xl pb-12 text-center">
            <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              ¿Cómo deseas utilizar KippiLex?
            </h1>
            <p className="mt-4 text-lg text-indigo-200/65">
              Selecciona tu rol para comenzar
            </p>
          </div>

          {/* ... (Tu JSX de las tarjetas de rol va aquí - no necesita cambios) ... */}
          <div className="mx-auto grid max-w-sm gap-8 sm:max-w-none sm:grid-cols-2 lg:max-w-3xl">

            {/* Tarjeta 1: Soy Abogado */}
            <button
              onClick={() => handleRoleSelection('abogado')}
              disabled={loading}
              className="group relative flex flex-col items-center rounded-2xl bg-linear-to-br from-gray-900/50 via-gray-800/25 to-gray-900/50 p-8 text-center backdrop-blur-xs transition-all duration-300 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,var(--color-gray-800),var(--color-gray-700),var(--color-gray-800))_border_box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear_gradient(white_0_0)] hover:before:border-indigo-500/50 disabled:opacity-50"
            >
              {/* ... (Contenido de la tarjeta) ... */}
              <h3 className="mb-2 text-xl font-semibold text-gray-200">Soy Abogado</h3>
              <p className="text-indigo-200/65">Únete a nuestra red de profesionales y encuentra nuevos clientes.</p>
            </button>

            {/* Tarjeta 2: Necesito Abogado (Cliente) */}
            <button
              onClick={() => handleRoleSelection('cliente')}
              disabled={loading}
              className="group relative flex flex-col items-center rounded-2xl bg-linear-to-br from-gray-900/50 via-gray-800/25 to-gray-900/50 p-8 text-center backdrop-blur-xs transition-all duration-300 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,var(--color-gray-800),var(--color-gray-700),var(--color-gray-800))_border_box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear_gradient(white_0_0)] hover:before:border-indigo-500/50 disabled:opacity-50"
            >
              {/* ... (Contenido de la tarjeta) ... */}
              <h3 className="mb-2 text-xl font-semibold text-gray-200">Necesito Abogado</h3>
              <p className="text-indigo-200/65">Conecta con profesionales verificados para resolver tus problemas legales.</p>
            </button>
          </div>
          {/* ... (Fin de las tarjetas) ... */}

          {errorMsg && (
            <p className="mt-8 text-center text-red-500">{errorMsg}</p>
          )}
        </div>
      </div>
    </section>
  );
}