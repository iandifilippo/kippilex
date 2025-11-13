// RUTA: app/dashboard/perfil/page.tsx
// ESTADO: CORREGIDO (Arregla bugs de carga, avatar y lápiz funcional)

"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner'; // Importamos el Spinner
import AvatarUpload from '@/components/ui/AvatarUpload'; // Importamos el componente de Avatar

type ProfileData = {
  nombre: string | null;
  apellido: string | null;
  genero: string | null;
  whatsapp: string | null;
  avatar_url: string | null; // Añadimos avatar_url
};

export default function PerfilPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true); // Empezar cargando
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
      // Con los permisos RLS (Paso 1), esta query ahora SÍ funcionará
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
      console.error(error);
    } else {
      setMessage('¡Perfil actualizado con éxito!');
      router.refresh(); 
    }
    setLoading(false);
  };
  
  // --- VISTA DE CARGA ---
  if (loading || !user) {
     return <LoadingSpinner />;
  }
  
  // --- VISTA DE ERROR (Si RLS falló) ---
  if (!profile) {
    return <div className="p-8 text-center text-red-400">Error al cargar el perfil. Asegúrate de haber seleccionado un rol.</div>;
  }

  // --- VISTA DE PERFIL (Carga exitosa) ---
  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 py-12 md:py-20 text-white">
      
      {/* Tarjeta de Perfil Superior (Avatar y Nombre) */}
      <div className="rounded-2xl border border-gray-800/50 bg-gray-900/50 p-6 shadow-lg flex items-center gap-6 mb-8">
        
        {/* Lápiz Funcional (usa el avatar de 'profiles' o el de Google como fallback) */}
        <AvatarUpload 
          user={user}
          initialAvatarUrl={profile.avatar_url || user.user_metadata.avatar_url}
          onUploadSuccess={(newUrl) => {
            setProfile(prev => (prev ? { ...prev, avatar_url: newUrl } : null));
            router.refresh(); 
          }}
        />

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
        <h2 className="text-xl font-bold mb-6">Información Personal</h2>
        <p className="text-sm text-gray-400 mb-6">Actualiza tu información de perfil</p>
        
        <form onSubmit={handleUpdateProfile}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ... (Tus campos de formulario: Nombre, Apellido, Email, Género, WhatsApp) ... */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300" htmlFor="nombre">Nombre</label>
              <input id="nombre" type="text" name="nombre" value={profile.nombre || ''} onChange={handleInputChange} className="form-input w-full" placeholder="Tu nombre" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300" htmlFor="apellido">Apellido</label>
              <input id="apellido" type="text" name="apellido" value={profile.apellido || ''} onChange={handleInputChange} className="form-input w-full" placeholder="Tu apellido" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300" htmlFor="email">Email</label>
              <input id="email" type="email" value={user.email || ''} className="form-input w-full bg-gray-800 border-gray-700 cursor-not-allowed" placeholder="Tu email" disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300" htmlFor="genero">Género</label>
              <select id="genero" name="genero" value={profile.genero || ''} onChange={handleInputChange} className="form-select w-full" >
                <option value="">Seleccionar...</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-300" htmlFor="whatsapp">Número WhatsApp</label>
              <input id="whatsapp" type="tel" name="whatsapp" value={profile.whatsapp || ''} onChange={handleInputChange} className="form-input w-full" placeholder="Ej: 3101234567" />
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-4 mt-8">
            {message && <p className="text-sm text-indigo-400">{message}</p>}
            <button type="submit" disabled={loading} className="btn bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg disabled:opacity-50">
              {loading ? <LoadingSpinner /> : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}