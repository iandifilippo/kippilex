"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Image from 'next/image';

const ESPECIALIDADES = [
  { name: "1. Derecho Público", subs: ["Constitucional", "Administrativo", "Electoral", "Tributario o Fiscal", "Urbanístico", "Ambiental Público", "Función Pública", "Contratación Estatal", "Municipal y Territorial", "Minero-Energético (Estatal)"] },
  { name: "2. Derecho Privado", subs: ["Civil (Rama madre)", "Contratos", "Responsabilidad Civil", "Bienes", "Sucesiones y Familia", "Obligaciones", "Comercial o Mercantil", "Sociedades", "Títulos Valores", "Contratos Mercantiles", "Derecho Concursal", "Derecho Bancario", "Propiedad Industrial y Competencia", "Inmobiliario y Notarial"] },
  { name: "3. Derecho Penal", subs: ["Penal General y Especial", "Procesal Penal", "Penal Económico y Empresarial", "Penal Internacional", "Penitenciario y Ejecución de Penas", "Criminología y Política Criminal", "Menores Infractores (RPA)"] },
  { name: "4. Derecho Laboral y S. Social", subs: ["Individual del Trabajo", "Colectivo del Trabajo", "Procesal Laboral", "Seguridad Social", "Pensional y Riesgos Laborales"] },
  { name: "5. Derecho Económico y Empresarial", subs: ["Económico", "Financiero y Bursátil", "Bancario", "Competencia y Consumo", "Empresa y Emprendimiento", "Aduanero y Cambiario", "Tributario Empresarial", "Comercio Internacional"] },
  { name: "6. Derecho Internacional", subs: ["Internacional Público", "Internacional Privado", "Internacional Humanitario", "Derechos Humanos", "Diplomático y Consular", "Migratorio"] },
  { name: "7. Derecho Procesal", subs: ["Procesal Civil", "Procesal Penal", "Procesal Administrativo", "Procesal Laboral", "Procesal Constitucional", "Derecho Probatorio", "Arbitraje y Conciliación"] },
  { name: "8. Derecho Social y de Interés Público", subs: ["De Familia", "Infancia y Adolescencia", "Género y Diversidad", "Salud y Bioética Jurídica", "Rural y Agrario", "Indígena y Pluralismo Jurídico", "Comunitario (CAN, MERCOSUR)"] },
  { name: "9. Derecho Ambiental y Energético", subs: ["Ambiental General", "Recursos Naturales", "Minero-Energético", "Cambio Climático"] },
  { name: "10. Derecho Militar y de Policía", subs: ["Penal Militar", "Disciplinario", "Operacional Militar", "Internacional Humanitario (Fuerzas Armadas)"] },
  { name: "11. Derecho de la Tecnología y Datos", subs: ["Informático", "Digital", "Protección de Datos Personales (Habeas Data)", "Ciberseguridad", "Inteligencia Artificial"] },
  { name: "12. Otras Especializaciones", subs: ["Médico y Sanitario", "Deportivo", "Marítimo", "Derecho Animal", "Compliance"] },
];

type ProfileData = {
  nombre: string | null;
  apellido: string | null;
  genero: string | null;
  whatsapp: string | null;
  avatar_url: string | null;
  role: string | null;
  especialidades: string[];
  verification_status: string | null;
};

export default function PerfilPage() {
  const supabase = createClient();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [memberSince, setMemberSince] = useState('');
  const [selectedSub, setSelectedSub] = useState('');
  const [especialidadFile, setEspecialidadFile] = useState<File | null>(null);
  const [uploadingEspecialidad, setUploadingEspecialidad] = useState(false);
  const [uploadingFoto, setUploadingFoto] = useState(false);

  // Estado local para el formulario (ESTO ES LO QUE ARREGLA TODO)
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    genero: '',
    whatsapp: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/signin');
        return;
      }
      setUser(user);

      const joinDate = new Date(user.created_at);
      const formatted = joinDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
      setMemberSince(formatted.charAt(0).toUpperCase() + formatted.slice(1));

      const { data, error } = await supabase
        .from('profiles')
        .select('nombre, apellido, genero, whatsapp, avatar_url, role, especialidades, verification_status')
        .eq('id', user.id)
        .single();

      if (error || !data) {
        console.log("Error o perfil vacío, forzando refresh...", error);
        router.refresh();
        return;
      }

      setProfile(data);

      // COPIAMOS LOS DATOS AL FORMULARIO LOCAL (ESTO ES CLAVE)
      setFormData({
        nombre: data.nombre || '',
        apellido: data.apellido || '',
        genero: data.genero || '',
        whatsapp: data.whatsapp || '',
      });

      setLoading(false);
    };
    fetchData();
  }, [supabase, router]);

  // CAMBIOS EN EL FORMULARIO LOCAL
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUploadingFoto(true);
    setMessage('');

    const { error } = await supabase
      .from('profiles')
      .update({
        nombre: formData.nombre,
        apellido: formData.apellido,
        genero: formData.genero,
        whatsapp: formData.whatsapp,
      })
      .eq('id', user.id);

    if (error) {
      setMessage('Error al actualizar el perfil.');
    } else {
      setMessage('¡Perfil actualizado con éxito!');
      setProfile(prev => prev ? { ...prev, ...formData } : null);

      setTimeout(() => setMessage(''), 4000);
    }
    setUploadingFoto(false);
    setTimeout(() => setMessage(''), 4000);
  };

  // SUBIR FOTO DE PERFIL
  const handlePhotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !user) return;

    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `avatar_${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    setUploadingFoto(true);
    setMessage('');

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setMessage('Error al subir la foto');
      setUploadingFoto(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

    const { error } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id);

    if (error) {
      setMessage('Error al guardar la foto');
    } else {
      setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
      setMessage('¡Foto actualizada con éxito!');
      router.refresh();
    }
    setUploadingFoto(false);
  };

  // AÑADIR ESPECIALIDAD
  const handleAddEspecialidad = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedSub || !especialidadFile || !user) return;

    setUploadingEspecialidad(true);
    setMessage('');

    const fileExt = especialidadFile.name.split('.').pop();
    const fileName = `doc_${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('documentos-abogados')
      .upload(filePath, especialidadFile, { upsert: true });

    if (uploadError) {
      setMessage('Error al subir documento');
      setUploadingEspecialidad(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('documentos-abogados').getPublicUrl(filePath);

    const nuevas = [...(profile?.especialidades || []), selectedSub];

    const { error } = await supabase
      .from('profiles')
      .update({
        especialidades: nuevas,
        documento_verificacion_url: publicUrl,
        verification_status: 'pending'
      })
      .eq('id', user.id);

    if (error) {
      setMessage('Error al enviar a verificación');
    } else {
      setProfile(prev => prev ? { ...prev, especialidades: nuevas, verification_status: 'pending' } : null);
      setSelectedSub('');
      setEspecialidadFile(null);
      setMessage('¡Especialidad enviada a verificación!');
      router.refresh();
    }
    setUploadingEspecialidad(false);
  };

  if (loading) return <LoadingSpinner />;
  if (!profile) return <div className="text-center text-red-400 p-8">Error al cargar perfil</div>;

  const isAbogado = profile.role === 'abogado';
  const isPending = profile.verification_status === 'pending';

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Foto y nombre */}
        <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-3xl p-8 border border-purple-800/30 shadow-2xl">
          <div className="flex items-center gap-6">
            
            {/* CORRECCIÓN APLICADA AQUÍ: Se agregaron clases para fijar tamaño y recortar */}
            <div className="relative shrink-0">
              <Image
                src={profile.avatar_url || user.user_metadata?.avatar_url || '/images/default-avatar.png'}
                width={140}
                height={140}
                alt="Perfil"
                className="rounded-full border-4 border-purple-500 shadow-2xl object-cover w-[140px] h-[140px]"
              />
              <label className="absolute bottom-2 right-2 cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} disabled={uploadingFoto} />
                <div className="bg-indigo-600 hover:bg-indigo-700 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </label>
            </div>
            
            <div>
              <h1 className="text-4xl font-bold text-white">
                {profile.nombre || 'Usuario'} {profile.apellido || ''}
              </h1>
              <p className="text-purple-300 text-xl">Miembro desde {memberSince}</p>
            </div>
          </div>
        </div>

        {/* Formulario básico */}
        <div className="bg-gray-900/80 backdrop-blur-lg rounded-3xl p-8 border border-gray-800 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Información Personal</h2>
              <p className="text-gray-400">Actualiza tu información de perfil</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nombre</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition" placeholder="" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Apellido</label>
                <input type="text" name="apellido" value={formData.apellido} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition" placeholder="" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input type="email" value={user.email || ''} disabled className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-500 cursor-not-allowed" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Número WhatsApp</label>
                <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition" placeholder="" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Género</label>
                <select name="genero" value={formData.genero} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition">
                  <option value="">Seleccionar...</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6">
              {message && (
                <span className={`text-sm font-medium ${message.includes('éxito') ? 'text-green-400' : 'text-red-400'}`}>
                  {message}
                </span>
              )}
              <button type="submit" disabled={uploadingFoto} className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg disabled:opacity-60 transition transform hover:scale-105">
                {uploadingFoto ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>

        {/* SECCIÓN ABOGADOS */}
        {isAbogado && (
          <div className="bg-gray-900/80 backdrop-blur-lg rounded-3xl p-8 border border-gray-800 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-6">Mis Especialidades</h2>

            {isPending && (
              <div className="mb-6 p-5 bg-yellow-900/70 border border-yellow-600 rounded-2xl text-yellow-200 text-center font-medium">
                Tu perfil está en verificación. Podrás recibir casos cuando sea aprobado.
              </div>
            )}

            <div className="flex flex-wrap gap-3 mb-8">
              {profile.especialidades.length > 0 ? profile.especialidades.map((esp, i) => (
                <span key={i} className="px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full text-white font-medium shadow-lg">
                  {esp}
                </span>
              )) : (
                <p className="text-gray-400 italic">Aún no tienes especialidades aprobadas</p>
              )}
            </div>

            <form onSubmit={handleAddEspecialidad} className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-300 mb-3">Selecciona una nueva especialidad</label>
                <select value={selectedSub} onChange={(e) => setSelectedSub(e.target.value)} className="w-full px-5 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30" required>
                  <option value="">-- Elige una sub-especialidad --</option>
                  {ESPECIALIDADES.map(cat => (
                    <optgroup key={cat.name} label={cat.name}>
                      {cat.subs.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-300 mb-3">Documento de respaldo (PDF)</label>
                <input type="file" accept=".pdf" onChange={(e) => e.target.files && setEspecialidadFile(e.target.files[0])} className="w-full px-5 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white file:mr-5 file:py-3 file:px-6 file:rounded-full file:border-0 file:bg-gradient-to-r file:from-purple-600 file:to-indigo-600 file:text-white hover:file:from-purple-700 hover:file:to-indigo-700" required />
              </div>

              <button type="submit" disabled={uploadingEspecialidad} className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-xl rounded-xl shadow-2xl transition transform hover:scale-105 disabled:opacity-70">
                {uploadingEspecialidad ? 'Enviando...' : 'Enviar nueva especialidad a verificación'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}