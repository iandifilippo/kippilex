// RUTA: app/dashboard/perfil/page.tsx
// ESTADO: CORREGIDO (Arreglados los errores de <lebel> y 'size')

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
  avatar_url: string | null; 
};

export default function PerfilPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true); 
  const [formLoading, setFormLoading] = useState(false); 
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
      
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('nombre, apellido, genero, whatsapp, avatar_url')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error al cargar el perfil:', error);
        setProfile(null); 
      } else {
        setProfile(profileData);
      }
      setLoading(false);
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
    
    setFormLoading(true);
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
    
    setFormLoading(false);
    setTimeout(() => setMessage(''), 3000); 
  };
  
  if (loading || !user) {
     return <LoadingSpinner />;
  }
  
  if (!profile) {
    return <div className="p-8 text-center text-red-400">Error al cargar el perfil.</div>;
  }

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 py-12 md:py-20 text-white">
      
      <div className="rounded-2xl border border-gray-800/50 bg-gray-900/50 p-6 shadow-lg flex items-center gap-6 mb-8">
        
        <div className="relative shrink-0">
          <Image
            src={profile.avatar_url || user.user_metadata?.avatar_url || '/images/default-avatar.png'}
            width={96}
            height={96}
            alt="Avatar"
            className="rounded-full"
          />
          <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 border-2 border-gray-900 opacity-50 cursor-not-allowed">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
       </button>
        </div>

        <div>
          <h1 className="text-2xl font-bold">
            {profile.nombre || user.user_metadata.full_name || 'Usuario'}
          </h1>
          <p className="text-sm text-gray-400">
            Miembro desde {memberSince}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-800/50 bg-gray-900/50 p-6 sm:p-8 shadow-lg">
        <h2 className="text-xl font-bold mb-2">Información Personal</h2>
        <p className="text-sm text-gray-400 mb-6">Actualiza tu información de perfil</p>
        
        <form onSubmit={handleUpdateProfile} className="space-y-5">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={profile.nombre || ''}
                onChange={handleInputChange}
                className="form-input w-full rounded-md border-gray-700 bg-gray-800 text-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Tu nombre"
              />
            </div>
            <div>
              <label htmlFor="apellido" className="block text-sm font-medium text-gray-300 mb-1">Apellido</label>
              <input
                type="text"
                id="apellido"
                name="apellido"
             value={profile.apellido || ''}
                onChange={handleInputChange}
                className="form-input w-full rounded-md border-gray-700 bg-gray-800 text-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Tu apellido"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              id="email"
              value={user.email || ''}
           disabled 
              className="form-input w-full rounded-md border-gray-700 bg-gray-900/50 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
            | <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-300 mb-1">Número (WhatsApp)</label>
              <input
                type="tel"
                id="whatsapp"
                name="whatsapp"
                value={profile.whatsapp || ''}
                onChange={handleInputChange}
                className="form-input w-full rounded-md border-gray-700 bg-gray-800 text-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="+57 300 123 4567"
              />
            </div>
            <div>
              {/* --- CORRECCIÓN: Error de tipeo </lebel> --- */}
          <label htmlFor="genero" className="block text-sm font-medium text-gray-300 mb-1">Género</label>
              <select
                id="genero"
                name="genero"
                value={profile.genero || ''}
                onChange={handleInputChange}
            className="form-select w-full rounded-md border-gray-700 bg-gray-800 text-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Seleccionar...</option>
                <option value="masculino">Masculino</option>
          <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
                <option value="no_especificar">Prefiero no especificar</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-2">
            {message && (
              <span className={`text-sm ${message.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
             {message}
              </span>
            )}
            <button
              type="submit"
              className="btn bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg disabled:opacity-50 flex items-center justify-center w-36"
              disabled={formLoading}
            >
              {/* --- CORRECCIÓN: Se quitó la propiedad 'size="sm"' --- */}
              {formLoading ? <LoadingSpinner /> : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </section>
);
}