// --- CÓDIGO FINAL Y DEFINITIVO: app/seleccionar-rol/page.tsx ---

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

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: role })
      .eq('id', user.id); 

    if (updateError) {
      setErrorMsg('Hubo un error al guardar tu elección. Por favor, intenta de nuevo.');
      console.error(updateError);
      setLoading(false);
    } else {
      // 3. ¡Éxito! REDIRECCIÓN FORZADA (El truco más robusto)
      if (role === 'abogado') {
        window.location.href = '/completar-perfil-abogado'; // RUTA CORRECTA
      } else {
        window.location.href = '/dashboard'; // RUTA CORRECTA para el cliente
      }
    }
  };

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Encabezado */}
          <div className="mx-auto max-w-3xl pb-12 text-center">
            <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              ¿Cómo deseas utilizar KippiLex?
            </h1>
            <p className="mt-4 text-lg text-indigo-200/65">
              Selecciona tu rol para comenzar
            </p>
          </div>

          {/* Contenedor de Tarjetas */}
          <div className="mx-auto grid max-w-sm gap-8 sm:max-w-none sm:grid-cols-2 lg:max-w-3xl">

            {/* Tarjeta 1: Soy Abogado */}
            <button
              onClick={() => handleRoleSelection('abogado')}
              disabled={loading}
              className="group relative flex flex-col items-center rounded-2xl bg-linear-to-br from-gray-900/50 via-gray-800/25 to-gray-900/50 p-8 text-center backdrop-blur-xs transition-all duration-300 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,var(--color-gray-800),var(--color-gray-700),var(--color-gray-800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:before:border-indigo-500/50 disabled:opacity-50"
            >
              {/* Icono (Placeholder) */}
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/20">
                <svg className="h-8 w-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-200">Soy Abogado</h3>
              <p className="text-indigo-200/65">Únete a nuestra red de profesionales y encuentra nuevos clientes.</p>
              <span className="btn-sm mt-6 rounded-full bg-linear-to-t from-indigo-600 to-indigo-500 text-white shadow-lg">
                Registrarme como Abogado
              </span>
            </button>

            {/* Tarjeta 2: Necesito Abogado (Cliente) */}
            <button
              onClick={() => handleRoleSelection('cliente')}
              disabled={loading}
              className="group relative flex flex-col items-center rounded-2xl bg-linear-to-br from-gray-900/50 via-gray-800/25 to-gray-900/50 p-8 text-center backdrop-blur-xs transition-all duration-300 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,var(--color-gray-800),var(--color-gray-700),var(--color-gray-800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:before:border-indigo-500/50 disabled:opacity-50"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/20">
                <svg className="h-8 w-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-200">Necesito Abogado</h3>
              <p className="text-indigo-200/65">Conecta con profesionales verificados para resolver tus problemas legales.</p>
              <span className="btn-sm mt-6 rounded-full bg-linear-to-t from-indigo-600 to-indigo-500 text-white shadow-lg">
                Buscar un Abogado
              </span>
            </button>

          </div>

          {/* Mensaje de Error */}
          {errorMsg && (
            <p className="mt-8 text-center text-red-500">{errorMsg}</p>
          )}

        </div>
      </div>
    </section>
  );
}