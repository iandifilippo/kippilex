// RUTA: components/ui/AvatarUpload.tsx
// ESTADO: NUEVO ARCHIVO

"use client";

import { useState, useEffect, ChangeEvent } from 'react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import type { User } from '@supabase/supabase-js';

type AvatarUploadProps = {
  user: User;
  initialAvatarUrl: string | null;
  onUploadSuccess: (newUrl: string) => void;
};

export default function AvatarUpload({ user, initialAvatarUrl, onUploadSuccess }: AvatarUploadProps) {
  const supabase = createClient();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setAvatarUrl(initialAvatarUrl);
  }, [initialAvatarUrl]);

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('Debes seleccionar una imagen para subir.');
      }

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Math.random()}.${fileExt}`;

      // 1. Subir al bucket 'avatars'
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      // 2. Obtener URL pública
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const newAvatarUrl = data.publicUrl;

      // 3. Actualizar la tabla 'profiles'
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: newAvatarUrl })
        .eq('id', user.id);
      if (updateError) throw updateError;
      
      setAvatarUrl(newAvatarUrl);
      onUploadSuccess(newAvatarUrl); // Notificar al padre

    } catch (error) {
      alert('Error al subir la imagen. Asegúrate de que pese menos de 1MB.');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <Image
        src={avatarUrl || '/images/default-avatar.png'} // (Necesitas un avatar por defecto)
        width={96}
        height={96}
        alt="Avatar"
        className="rounded-full"
      />
      <label
        htmlFor="avatar-upload"
        className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700 border-2 border-gray-900 cursor-pointer"
      >
        {uploading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
        )}
      </label>
      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
        disabled={uploading}
      />
    </div>
  );
}