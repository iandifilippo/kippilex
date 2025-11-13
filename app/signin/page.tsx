"use client";

import { useEffect } from 'react'; // Necesario para el Guardia de Auth
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from "next/link";

export default function SignIn() {
  // Eliminamos email, password, y errorMsg state
  // const [email, setEmail] = useState(''); 
  // const [password, setPassword] = useState(''); 
  // const [errorMsg, setErrorMsg] = useState(''); 
  
  const router = useRouter();
  const supabase = createClient();

  // --- GUARDIA DE AUTENTICACIÓN (Se mantiene) ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/dashboard');
      }
    });
  }, [router, supabase]); 
  
  // Eliminamos handleSignIn

  // --- Función para Ingresar con Google (Se mantiene) ---
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
          {/* Section header */}
          <div className="pb-12 text-center">
            <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Bienvenido de vuelta
            </h1>
          </div>
          
          {/* --- NUEVO BLOQUE: Solo Botón de Google y Reset --- */}
          <div className="mx-auto max-w-[400px]">
            
            {/* Link para restablecer contraseña */}
            <div className="mb-4 text-center">
                <Link
                    className="text-sm text-gray-400 hover:underline"
                    href="/reset-password"
                >                </Link>
            </div>
            
            <div className="mt-6 space-y-5">
              <button
                type="button" 
                className="btn w-full bg-linear-to-t from-indigo-600 to-indigo-500 text-white shadow-lg" // Usamos el estilo del botón primario
                onClick={handleGoogleSignIn}
              >
                Ingresar con Google
              </button>
            </div>
          </div>
          
          {/* Bottom link */}
          <div className="mt-6 text-center text-sm text-indigo-200/65">
            ¿No tienes una cuenta?{" "}
            <Link className="font-medium text-indigo-500" href="/signup">
              Regístrate
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}