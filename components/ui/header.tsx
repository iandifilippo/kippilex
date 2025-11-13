"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import type { Session } from '@supabase/supabase-js';

// Definimos un tipo para el perfil que esperamos
type Profile = {
  nombre: string;
}

export default function Header() {
  const supabase = createClient();
  const router = useRouter();
  
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('nombre')
          .eq('id', session.user.id)
          .single();
        setProfile(profileData);
      }
    };
    fetchData();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        if (newSession) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('nombre')
            .eq('id', newSession.user.id)
            .single();
          setProfile(profileData);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
    router.push('/');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    setMenuOpen(false);
  };

  // --- CORRECCIÓN "Hola, Usuario" ---
  // 1. Intenta obtener el nombre del perfil (que llenas en el formulario)
  const profileName = profile?.nombre?.split(' ')[0];
  // 2. Si no existe, obtén el nombre de la sesión de Google
  const googleName = session?.user.user_metadata?.full_name?.split(' ')[0];
  // 3. Usa el primero que exista, o "Usuario" como último recurso
  const displayName = profileName || googleName || 'Usuario';
  // --- FIN DE LA CORRECCIÓN ---

  return (
    <header className="z-30 mt-2 w-full md:mt-5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex h-16 items-center justify-between gap-3 rounded-2xl bg-gray-900/90 px-3 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,var(--color-gray-800),var(--color-gray-700),var(--color-gray-800))_border_box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] after:absolute after:inset-0 after:-z-10 after:backdrop-blur-xs">
          
          {/* Logo */}
          <div className="flex flex-1 items-center">
            <Link href="/" aria-label="KippiLex">
              <Image
                src="/images/kippilexlogo.png"
                width={48} 
                height={48}
                alt="KippiLex Logo"
                priority={true}
              />
            </Link>
          </div>

          {/* Navegación Dinámica */}
          <div className="flex flex-1 items-center justify-end">
            {session ? (
              // --- VISTA: USUARIO LOGUEADO ---
              <div className="flex items-center gap-3 sm:gap-4">
                
                <span className="text-sm text-gray-300 hidden md:block">
                  Hola, {displayName}
                </span>

                {/* Botón de Notificaciones */}
                <div className="relative">
                  <button
                    onClick={toggleNotifications}
                    className="btn-sm flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 p-0 text-gray-400 hover:bg-gray-700/70"
                    aria-label="Notificaciones"
                  >
                    <BellIcon />
                  </button>
                  
                  {notificationsOpen && (
                    <div className="absolute top-full right-0 mt-2 w-72 origin-top-right rounded-xl bg-white p-4 shadow-lg text-gray-800">
                      <div className="mb-2 flex items-center justify-between px-2">
                        <h3 className="font-semibold">Notificaciones</h3>
                      </div>
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                          <BellIcon className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="text-lg font-semibold text-gray-700">No hay notificaciones</p>
                        <p className="text-sm text-gray-500">Te notificaremos cuando tengas novedades</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Botón de Menú de Usuario */}
                <div className="relative">
                  <button
                    onClick={toggleMenu}
                    className="btn-sm flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 p-0 text-gray-400 hover:bg-gray-700/70"
                    aria-label="Menú de usuario"
                  >
                    <MenuIcon />
                  </button>

                  {/* Dropdown de Menú (basado en tu imagen) */}
                  {menuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-60 origin-top-right rounded-xl bg-white p-2 shadow-lg text-gray-800">
                      <div className="p-2">
                        <h4 className="font-bold">Menú</h4>
                      </div>
                      <ul className="flex flex-col">
                        {/* --- ENLACES CORREGIDOS --- */}
                        <MenuItem href="/dashboard" icon={<CaseIcon />} label="Mis Casos" />
                        <MenuItem href="/dashboard/perfil" icon={<UserIcon />} label="Mi Perfil" />
                        <MenuItem href="/dashboard/configuracion" icon={<SettingsIcon />} label="Configuraciones" />
                        {/* "Conversaciones" y "Opinión" eliminados */}
                        <li>
                          <button
                            onClick={handleSignOut}
                            className="flex w-full items-center gap-3 rounded-md p-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <SignOutIcon />
                            <span>Cerrar Sesión</span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>

            ) : (
              // --- VISTA: USUARIO DESCONECTADO ---
              <ul className="flex items-center gap-3">
                <li>
                  <Link
                    href="/signin"
                    className="btn-sm relative bg-linear-to-b from-gray-800 to-gray-800/60 bg-[length:100%_100%] bg-[bottom] py-[5px] text-gray-300 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,var(--color-gray-800),var(--color-gray-700),var(--color-gray-800))_border_box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear_gradient(white_0_0)] hover:bg-[length:100%_150%]"
                  >
                    Ingresar
                  </Link>
                </li>
                <li>
                  <Link
                    href="/signup"
                    className="btn-sm bg-linear-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] py-[5px] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%]"
                  >
                    Registrarse
                  </Link>
                </li>
              </ul>
            )}
          </div>
          
        </div>
      </div>
    </header>
  );
}


// --- Componente para los items del Menú ---
const MenuItem = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
  <li>
    <Link
      href={href}
      className="flex items-center gap-3 rounded-md p-2 text-sm text-gray-700 hover:bg-gray-100"
    >
      {icon}
      <span>{label}</span>
    </Link>
  </li>
);

// --- Componentes de Iconos (SVGs) ---
const BellIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.017 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
  </svg>
);
const MenuIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);
const CaseIcon = () => <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const UserIcon = () => <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const SettingsIcon = () => <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const SignOutIcon = () => <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;