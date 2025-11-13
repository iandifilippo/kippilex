// RUTA: app/signup/page.tsx
// ESTADO: CORREGIDO

"use client"; 

import { useEffect } from 'react'; 
import { createClient } from '@/utils/supabase/client'; 
import { useRouter } from 'next/navigation'; 
import Link from "next/link";

export default function SignUp() {
  const router = useRouter();
  const supabase = createClient();

  // --- GUARDIA DE AUTENTICACIÓN ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/dashboard'); // Redirige si ya está logueado
      }
    });
  }, [router, supabase]); 
  // --- FIN DEL GUARDIA ---


  // --- Función para Registrarse con Google ---
  const handleGoogleSignUp = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // --- ESTA ES LA CORRECCIÓN CLAVE ---
        // Esto asegura que Google te devuelva al "callback"
        // y no a la página de inicio.
        redirectTo: `${location.origin}/auth/callback` 
      },
    });
  };

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="pb-12 text-center">
            <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Crea una cuenta
            </h1>
          </div>
          
          {/* Formulario (Solo botón de Google) */}
          <div className="mx-auto max-w-[400px]">
            <div className="mt-6 space-y-5">
              
              {/* Botón de Google */}
              <button 
                type="button" 
                className="btn relative w-full bg-linear-to-b from-gray-800 to-gray-800/60 bg-[length:100%_100%] bg-[bottom] text-gray-300 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,var(--color-gray-800),var(--color-gray-700),var(--color-gray-800))_border_box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear_gradient(white_0_0)] hover:bg-[length:100%_150%]"
                onClick={handleGoogleSignUp} // Cambiado de handleGoogleSignIn a handleGoogleSignUp
              >
                Registrarse con Google
              </button>

            </div>
          </div>
          
          {/* Link para ingresar */}
          <div className="mt-6 text-center text-sm text-indigo-200/65">
            ¿Ya tienes una cuenta?{" "}
            <Link className="font-medium text-indigo-500" href="/signin">
              Ingresa
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}