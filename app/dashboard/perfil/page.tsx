// RUTA: app/dashboard/perfil/page.tsx
// ESTADO: NUEVO ARCHIVO

"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Definimos los tipos para el perfil y el formulario
type ProfileData = {
  nombre: string | null;
  apellido: string | null;
  genero: string | null;
  whatsapp: string | null;
};

export default function PerfilPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileData>({
    nombre: '',
    apellido: '',
    genero: '',
    whatsapp: '',
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  // Estado para la fecha de registro
  const [memberSince, setMemberSince] = useState('');
  
  // Estado para el avatar
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/signin');
        return;
      }
      setUser(user);

      // Formatear fecha de registro
      const joinDate = new Date(user.created_at);
      const formattedDate = joinDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
      setMemberSince(formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1));
      
      // Obtener avatar de Google
      setAvatarUrl(user.user_metadata.avatar_url || null);

      // Obtener datos del perfil (nombre, apellido, etc.)
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('nombre, apellido, genero, whatsapp')
        .eq('id', user.id)
        .single();
      
      if (profileData) {
        setProfile(profileData);
      }
      
      setLoading(false);
    };
    fetchUserData();
  }, [supabase, router]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
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
      // Forzamos un refresh del router para que el header vea el nuevo nombre
      router.refresh(); 
    }
    setLoading(false);
  };
  
  // (La lógica para cambiar la foto es más compleja, por ahora solo la mostramos)

  if (loading && !user) {
     return <div className="p-8 text-center">Cargando...</div>;
  }

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 py-12 md:py-20 text-white">
      
      {/* Tarjeta de Perfil Superior (Avatar y Nombre) */}
      <div className="rounded-2xl border border-gray-800/50 bg-gray-900/50 p-6 shadow-lg flex items-center gap-6 mb-8">
        <div className="relative">
          <Image
            src={avatarUrl || '/images/default-avatar.png'} // (Necesitas un avatar por defecto)
            width={96}
            height={96}
            alt="Avatar"
            className="rounded-full"
          />
          {/* Botón de cambiar foto (sin funcionalidad aún) */}
          <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700 border-2 border-gray-900">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          </button>
        </div>
        <div>
          <h1 className="text-2xl font-bold">
            {profile.nombre || user?.user_metadata.full_name || 'Usuario'}
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
            
            {/* Nombre */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300" htmlFor="nombre">Nombre</label>
              <input id="nombre" type="text" name="nombre" value={profile.nombre || ''} onChange={handleInputChange} className="form-input w-full" placeholder="Tu nombre" />
            </div>
            
            {/* Apellido */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300" htmlFor="apellido">Apellido</label>
              <input id="apellido" type="text" name="apellido" value={profile.apellido || ''} onChange={handleInputChange} className="form-input w-full" placeholder="Tu apellido" />
            </div>

            {/* Email (Bloqueado) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300" htmlFor="email">Email</label>
              <input id="email" type="email" value={user?.email || ''} className="form-input w-full bg-gray-800 border-gray-700 cursor-not-allowed" placeholder="Tu email" disabled />
            </div>
            
            {/* Género */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300" htmlFor="genero">Género</label>
              <select id="genero" name="genero" value={profile.genero || ''} onChange={handleInputChange} className="form-select w-full" >
                <option value="">Seleccionar...</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            {/* WhatsApp */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-300" htmlFor="whatsapp">Número WhatsApp</label>
              <input id="whatsapp" type="tel" name="whatsapp" value={profile.whatsapp || ''} onChange={handleInputChange} className="form-input w-full" placeholder="Ej: 3101234567" />
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-4 mt-8">
            {message && <p className="text-sm text-indigo-400">{message}</p>}
            <button type="submit" disabled={loading} className="btn bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg disabled:opacity-50">
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>

    </section>
  );
}