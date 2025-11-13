// --- ESTE ES EL CONTENIDO COMPLETO DE app/completar-perfil-cliente/page.tsx ---
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

const COLOMBIAN_CITIES = [
  'Bogotá D.C.', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Cúcuta', 
  'Bucaramanga', 'Pereira', 'Santa Marta', 'Manizales', 'Neiva'
];

export default function ClientRegistrationForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    whatsapp: '', // Campo añadido
    ciudad: '',
    preferenciaContacto: '',
    aceptaTerminos: false,
  });

  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  
  // Lógica para pre-llenar Nombre/Apellido desde Supabase
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user && data.user.user_metadata?.full_name) {
        const [firstName, ...lastNameParts] = data.user.user_metadata.full_name.split(' ');
        setFormData(prev => ({
          ...prev,
          nombre: firstName || '',
          apellido: lastNameParts.join(' ') || '',
        }));
      }
    });
  }, [supabase]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { user } = (await supabase.auth.getUser()).data;

    if (!user) {
      alert("Error: No se encontró la sesión. Por favor, ingresa de nuevo.");
      setLoading(false);
      return;
    }

    // Actualizamos la tabla 'profiles' con los datos del cliente
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        nombre: formData.nombre,
        apellido: formData.apellido,
        whatsapp: formData.whatsapp, // Campo añadido
        ciudad: formData.ciudad,
        preferencia_contacto: formData.preferenciaContacto, 
      })
      .eq('id', user.id);

    setLoading(false);
    
    if (!updateError) {
      router.push('/dashboard'); 
    } else {
      alert('Error al guardar datos. Revisa la consola.');
      console.error('Error de BD:', updateError);
    }
  };


  return (
    <section className="bg-gray-950">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          <div className="pb-12 text-center">
            <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300))] bg-[length:200%_auto] bg-clip-text pb-5 font-nacelle text-4xl font-semibold text-transparent md:text-5xl">
              Completa tu perfil
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="mx-auto max-w-2xl relative rounded-2xl bg-gray-900/50 p-8 shadow-2xl backdrop-blur-sm">
            
            {/* Sección 1: Información Personal */}
            <div className="flex items-center gap-2 mb-6">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-sm font-bold text-white">1</span>
              <h2 className="text-xl font-semibold text-gray-200">Información Personal</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <label className="text-sm font-medium text-indigo-200/65" htmlFor="nombre">Nombre</label>
                <input id="nombre" type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} className="form-input w-full" placeholder="Nombre" required />
              </div>
              <div className="space-y-4">
                <label className="text-sm font-medium text-indigo-200/65" htmlFor="apellido">Apellido</label>
                <input id="apellido" type="text" name="apellido" value={formData.apellido} onChange={handleInputChange} className="form-input w-full" placeholder="Apellido" required />
              </div>
              
              {/* WhatsApp (Celular) y Ciudad */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-indigo-200/65" htmlFor="whatsapp">Número WhatsApp</label>
                <input id="whatsapp" type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} className="form-input w-full" placeholder="Ej: 310000000 Sin +57" required />
              </div>
              <div className="space-y-4">
                <label className="text-sm font-medium text-indigo-200/65" htmlFor="ciudad">Ciudad</label>
                <select id="ciudad" name="ciudad" value={formData.ciudad} onChange={handleInputChange} className="form-select w-full" required>
                  <option value="">Selecciona tu ciudad</option>
                  {COLOMBIAN_CITIES.map(city => (<option key={city} value={city}>{city}</option>))}
                </select>
              </div>
            </div>

            <hr className="my-10 border-gray-700/50" />
            
            {/* Sección 2: Preferencia de Contacto */}
            <div className="flex items-center gap-2 mb-6">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-sm font-bold text-white">2</span>
              <h2 className="text-xl font-semibold text-gray-200">¿Cómo prefieres recibir propuestas?</h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                
                {/* Opción 1: WhatsApp Directo */}
                <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, preferenciaContacto: 'whatsapp' }))}
                    className={`group flex flex-col items-center rounded-2xl p-6 text-center transition-all border ${
                        formData.preferenciaContacto === 'whatsapp' 
                        ? 'border-indigo-500 bg-indigo-500/10' 
                        : 'border-gray-800 bg-gray-800/40 hover:border-gray-600'
                    }`}
                >
                    <span className="mb-3 text-2xl">💬</span>
                    <h3 className="mb-1 text-base font-semibold text-gray-200">Contacto por WhatsApp</h3>
                    <p className="text-sm text-indigo-200/65">Recibe mensajes de abogados calificados directamente.</p>
                </button>

                {/* Opción 2: Revisar y Elegir */}
                <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, preferenciaContacto: 'revisar' }))}
                    className={`group flex flex-col items-center rounded-2xl p-6 text-center transition-all border ${
                        formData.preferenciaContacto === 'revisar' 
                        ? 'border-indigo-500 bg-indigo-500/10' 
                        : 'border-gray-800 bg-gray-800/40 hover:border-gray-600'
                    }`}
                >
                    <span className="mb-3 text-2xl">📋</span>
                    <h3 className="mb-1 text-base font-semibold text-gray-200">Prefiero revisar ofertas</h3>
                    <p className="text-sm text-indigo-200/65">Visualiza propuestas anónimas y elige el mejor perfil.</p>
                </button>
            </div>


            <hr className="my-10 border-gray-700/50" />
            
            {/* Términos y Botón Final */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center">
                <input id="terms" type="checkbox" name="aceptaTerminos" checked={formData.aceptaTerminos} onChange={handleInputChange} className="form-checkbox text-indigo-500" required />
                <label htmlFor="terms" className="ml-2 text-sm text-indigo-200/65">
                  Acepto los Términos y Condiciones
                </label>
              </div>

              <button type="submit" disabled={loading || !formData.preferenciaContacto} className="btn w-full max-w-sm bg-linear-to-t from-indigo-600 to-indigo-500 text-white shadow-lg disabled:opacity-50">
                {loading ? 'Completando...' : 'Completar Registro'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}