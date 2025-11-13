// RUTA: app/dashboard/perfil/page.tsx
// ESTADO: CORREGIDO (Arregla bug de carga y muestra foto de Google)

"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Image from 'next/image';

type ProfileData = {
  nombre: string | null;
  apellido: string | null;
  genero: string | null;
  whatsapp: string | null;
  avatar_url: string | null; // <-- Importante
};

export default function PerfilPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [memberSince, setMemberSince] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/signin');
        return;
      }
      setUser(user);

      const joinDate = new Date(user.created_at);
      const formattedDate = joinDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
      setMemberSince(formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1));
      
      // --- CORRECCIÓN DE BUGS DE CARGA Y AVATAR ---
      // Con los permisos RLS, esta query ahora SÍ funcionará
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('nombre, apellido, genero, whatsapp, avatar_url') // Pedimos el avatar_url
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error al cargar el perfil:', error);
        setProfile(null); 
      } else {
        setProfile(profileData);
      }
      setLoading(false); // Terminamos de cargar
    };
    fetchUserData();
  }, [supabase, router]);
  
  // (Tus funciones handleInputChange y handleUpdateProfile van aquí, están bien)
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => (prev ? { ...prev, [name]: value } : null));
  };
  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    setLoading(true);
    setMessage('');
    const { error } = await supabase
      .from('profiles')
      .update({
        nombre: profile.nombre,
        apellido: profile.apellido,
        genero: profile.genero,
        whatsapp: profile.whatsapp,
      })
      .eq('id', user.id);
    if (error) {
      setMessage('Error al actualizar el perfil. Intenta de nuevo.');
    } else {
      setMessage('¡Perfil actualizado con éxito!');
      router.refresh(); 
    }
    setLoading(false);
  };
  
  // --- VISTA DE CARGA (Usa el Spinner) ---
  if (loading || !user) {
     return <LoadingSpinner />;
  }
  
  // --- VISTA DE ERROR ---
  if (!profile) {
    return <div className="p-8 text-center text-red-400">Error al cargar el perfil.</div>;
  }

  // --- VISTA DE PERFIL (Carga exitosa) ---
  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 py-12 md:py-20 text-white">
      
      <div className="rounded-2xl border border-gray-800/50 bg-gray-900/50 p-6 shadow-lg flex items-center gap-6 mb-8">
        
        {/* --- FOTO DE GOOGLE --- */}
        <div className="relative">
          <Image
            src={profile.avatar_url || '/images/default-avatar.png'} // Usamos la foto de Google guardada
            width={96}
            height={96}
            alt="Avatar"
            className="rounded-full"
          />
          {/* Lápiz (sin funcionalidad por ahora, como solicitaste) */}
          <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 border-2 border-gray-900 opacity-50 cursor-not-allowed">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          </button>
        </div>
        {/* --- FIN FOTO --- */}

        <div>
          <h1 className="text-2xl font-bold">
            {profile.nombre || user.user_metadata.full_name || 'Usuario'}
          </h1>
          <p className="text-sm text-gray-400">
            Miembro desde {memberSince}
          </p>
        </div>
      </div>

      {/* Formulario de Información Personal */}
      <div className="rounded-2xl border border-gray-800/50 bg-gray-900/50 p-6 sm:p-8 shadow-lg">
        {/* ... (Tu formulario, está bien) ... */}
        <h2 className="text-xl font-bold mb-6">Información Personal</h2>
        <p className="text-sm text-gray-400 mb-6">Actualiza tu información de perfil</p>
        <form onSubmit={handleUpdateProfile}>
          {/* ... (Tus campos de formulario) ... */}
        </form>
      </div>
    </section>
  );
}