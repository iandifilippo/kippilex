// RUTA: app/dashboard/configuracion/page.tsx
// ESTADO: NUEVO ARCHIVO

"use client";

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function ConfiguracionPage() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Estados para los toggles (asumiendo valores por defecto)
  const [casoToggle, setCasoToggle] = useState(true);
  const [marketingToggle, setMarketingToggle] = useState(true);

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 py-12 md:py-20 text-white">
      <h1 className="text-3xl font-bold mb-10">Configuraciones</h1>

      {/* Sección de Email */}
      <div className="rounded-2xl border border-gray-800/50 bg-gray-900/50 p-6 sm:p-8 shadow-lg mb-8">
        <h2 className="text-xl font-bold mb-2">Email</h2>
        <p className="text-sm text-gray-400 mb-6">Administra qué tipos de notificaciones deseas recibir</p>
        
        <div className="space-y-4">
          
          {/* Toggle 1: Actualización de caso */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-100">Actualización de caso</h3>
              <p className="text-sm text-gray-400">Recibir email cuando un abogado es escogido para tu caso.</p>
            </div>
            <ToggleSwitch checked={casoToggle} onChange={() => setCasoToggle(!casoToggle)} />
          </div>

          {/* Toggle 2: Marketing */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-100">Marketing y novedades</h3>
              <p className="text-sm text-gray-400">Recibir email sobre nuevas funcionalidades, ofertas y encuestas.</p>
            </div>
            <ToggleSwitch checked={marketingToggle} onChange={() => setMarketingToggle(!marketingToggle)} />
          </div>

        </div>
      </div>

      {/* Sección de Eliminar Cuenta */}
      <div className="rounded-2xl border border-red-500/30 bg-red-900/20 p-6 sm:p-8 shadow-lg">
        <h2 className="text-xl font-bold text-red-300 mb-2">Eliminar Cuenta</h2>
        <p className="text-sm text-red-200/80 mb-6">
          Una vez eliminada tu cuenta, todos tus datos serán borrados permanentemente.
        </p>
        <button 
          onClick={() => setShowDeleteModal(true)}
          className="btn-sm bg-red-600 hover:bg-red-700 text-white shadow-lg"
        >
          Eliminar mi cuenta
        </button>
      </div>

      {/* Modal de Confirmación de Borrado */}
      {showDeleteModal && (
        <DeleteModal onClose={() => setShowDeleteModal(false)} />
      )}
    </section>
  );
}

// --- Componente de Toggle Switch (usando Tailwind) ---
const ToggleSwitch = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
  <button
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${checked ? 'bg-indigo-600' : 'bg-gray-700'}`}
    role="switch"
    aria-checked={checked}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`}
    />
  </button>
);

// --- Componente del Modal de Eliminación ---
const DeleteModal = ({ onClose }: { onClose: () => void }) => {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    
    // 1. Llamamos a la función SQL de Supabase
    const { error } = await supabase.rpc('delete_user_account');

    if (error) {
      console.error('Error al eliminar cuenta:', error);
      alert('Hubo un error al eliminar tu cuenta. Por favor, contacta a soporte.');
      setLoading(false);
    } else {
      // 2. Si tiene éxito, deslogueamos al usuario y lo mandamos al inicio
      await supabase.auth.signOut();
      router.push('/');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/75 p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl text-gray-800">
        <h2 className="text-2xl font-bold mb-4">¿Estás seguro que deseas eliminar tu cuenta?</h2>
        <p className="text-sm text-gray-600 mb-4">
          Esta acción no se puede deshacer. Esto eliminará permanentemente:
        </p>
        <ul className="list-disc space-y-2 pl-5 text-sm text-gray-600 mb-6">
          <li>Tu perfil y datos personales</li>
          <li>Todos tus casos legales y su historial</li>
          <li>Todas tus conversaciones y mensajes</li>
        </ul>
        <p className="text-sm text-gray-600 mb-6">
          Nota: Podrás crear una nueva cuenta con el mismo email en el futuro, pero no podrás recuperar ninguna información de esta cuenta.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="btn-sm bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="btn-sm bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
          >
            {loading ? 'Eliminando...' : 'Sí, eliminar mi cuenta'}
          </button>
        </div>
      </div>
    </div>
  );
};