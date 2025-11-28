"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, MapPin, Calendar } from 'lucide-react';

// Lista básica de departamentos (luego la haremos completa)
const DEPARTAMENTOS = ["Bogotá D.C.", "Antioquia", "Valle del Cauca", "Cundinamarca", "Atlántico"];

export default function ResumenCasoPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    ciudad: '',
    barrio: '',
    fecha_incidente: '',
    especialidades: [] as string[],
    anonimo: false
  });

  useEffect(() => {
    const fetchCaso = async () => {
      const { data, error } = await supabase
        .from('casos')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        alert("Error cargando el caso");
        router.push('/dashboard');
        return;
      }
      
      setFormData({
        titulo: data.titulo || '',
        descripcion: data.descripcion || '',
        ciudad: data.ciudad || '',
        barrio: data.barrio || '',
        fecha_incidente: data.fecha_incidente || '',
        especialidades: data.especialidades || [],
        anonimo: data.anonimo || false
      });
      setLoading(false);
    };
    fetchCaso();
  }, [params.id, router, supabase]);

  const handleUpdate = async (publicar: boolean) => {
    setPublishing(true);
    const { error } = await supabase
      .from('casos')
      .update({
        ...formData,
        estado: publicar ? 'abierto' : 'borrador' // Si publica es 'abierto', si solo guarda es 'borrador'
      })
      .eq('id', params.id);

    if (error) {
      alert("Error al actualizar");
      setPublishing(false);
    } else {
      if (publicar) {
        router.push('/dashboard/mis-casos'); // O a la vista del caso
      } else {
        alert("Borrador guardado");
        setPublishing(false);
      }
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Cargando resumen...</div>;

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-gray-900 rounded-3xl border border-gray-800 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 p-8 border-b border-gray-800">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            📄 Resumen del Caso
          </h1>
          <p className="text-gray-400 mt-2">
            Revisa y ajusta los detalles generados por Kippi antes de publicarlo a los abogados.
          </p>
        </div>

        <div className="p-8 space-y-8">
          
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">Título del Caso</label>
            <input 
              type="text" 
              value={formData.titulo} 
              onChange={(e) => setFormData({...formData, titulo: e.target.value})}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">Descripción Detallada</label>
            <textarea 
              rows={8}
              value={formData.descripcion} 
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 outline-none resize-none"
            />
          </div>

          {/* Ubicación y Fecha */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4"/> Ciudad / Municipio
              </label>
              <select 
                value={formData.ciudad}
                onChange={(e) => setFormData({...formData, ciudad: e.target.value})}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="">Seleccionar...</option>
                {DEPARTAMENTOS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4"/> Barrio / Localidad (Opcional)
              </label>
              <input 
                type="text" 
                value={formData.barrio} 
                onChange={(e) => setFormData({...formData, barrio: e.target.value})}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Ej. Chapinero"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2 flex items-center gap-2">
                 <Calendar className="w-4 h-4"/> Fecha Aproximada
              </label>
              <input 
                type="date" 
                value={formData.fecha_incidente} 
                onChange={(e) => setFormData({...formData, fecha_incidente: e.target.value})}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-4 pt-6 border-t border-gray-800">
            <Button 
              onClick={() => router.back()}
              variant="outline" 
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2"/> Volver al Chat
            </Button>
            
            <Button 
              onClick={() => handleUpdate(true)} // TRUE = Publicar
              disabled={publishing}
              className="flex-[2] bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-6 text-lg shadow-lg"
            >
              {publishing ? 'Publicando...' : '🚀 Publicar Caso Ahora'}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}