// RUTA: app/signin/page.tsx
// ESTADO: CORREGIDO (Arregla el Bug #1)

"use client";

import { useEffect } from 'react'; 
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Importamos Link

export default function SignIn() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/dashboard');
      }
    });
  }, [router, supabase]); 

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          
          <div className="pb-12 text-center">
            <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Bienvenido de vuelta
            </h1>
          </div>
          
          <div className="mx-auto max-w-[400px]">
            <button
              type="button" 
              className="btn relative w-full bg-linear-to-b from-gray-800 to-gray-800/60 bg-[length:100%_100%] bg-[bottom] text-gray-300 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,var(--color-gray-800),var(--color-gray-700),var(--color-gray-800))_border_box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear_gradient(white_0_0)] hover:bg-[length:100%_150%]"
              onClick={handleGoogleSignIn}
            >
              Ingresar con Google
            </button>
          </div>

          {/* --- ESTA ES LA CORRECCIÓN (Añadir el link de vuelta) --- */}
          <div className="mt-6 text-center text-sm text-indigo-200/65">
            ¿No tienes una cuenta?{" "}
            <Link className="font-medium text-indigo-500" href="/signup">
              Regístrate
            </Link>
          </div>
          {/* --- FIN DE LA CORRECCIÓN --- */}

        </div>
      </div>
    </section>
  );
}