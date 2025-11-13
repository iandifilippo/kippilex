import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

// Componente para las Tarjetas de Estadísticas (Necesario para el Cliente y Abogado)
const StatsCard = ({ title, value, unit, color }) => (
  <div className={`p-5 rounded-xl shadow-lg border ${color === 'blue' ? 'bg-indigo-500/10 border-indigo-400/30' : 'bg-gray-800/50 border-gray-700'}`}>
    <h3 className="text-3xl font-bold text-gray-100">{value}</h3>
    <p className="text-xs text-gray-400">{title}</p> 
    <p className="text-sm text-indigo-300 mt-2">{unit}</p>
  </div>
);
// --- FIN del Componente StatsCard ---


export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signin'); 
  }

  // 1. Traer todos los datos del perfil (nombre, rol, status)
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role, status, nombre, apellido')
    .eq('id', user.id)
    .single();

  if (error || !profile || !profile.role) {
    redirect('/seleccionar-rol'); 
  }

  const fullName = profile.nombre || user.email;
  // --- NUEVA VARIABLE DE ESTADO ---
  const isVerificationPending = profile.status === 'pending_verification' && profile.role === 'abogado';
  
  // --- CONTENIDO DEL DASHBOARD PRINCIPAL ---

  // El dashboard real se renderiza aquí (Cliente y Abogado Activo tienen contenido similar)
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 md:py-20">

      {/* 2. ENCABEZADO */}
      <h1 className="text-3xl font-bold text-gray-100 mb-8">
        ¡Bienvenido, {fullName}!
      </h1>
      
      {/* 3. Tarjetas de Estadísticas (Fila superior) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-10">
        <StatsCard title="Propuestas recibidas" value="0" unit="Últimos 30 días" color="purple" />
        <StatsCard title="Mensajes sin leer" value="0" unit="Conversaciones activas" color="blue" />
        <StatsCard title="Propuestas sin revisar" value="0" unit="Casos activos" color="green" />
      </div>

      {/* 4. SECCIÓN DE CASOS (Diferente según el Rol) */}
      <div className="rounded-2xl border border-gray-800/50 bg-gray-900/50 p-8 text-center shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-200 mb-6 border-b border-gray-700/50 pb-4 text-left">
          {profile.role === 'abogado' ? 'Casos Disponibles para Ofertar' : 'Casos Abiertos (Tus Solicitudes)'}
        </h2>
        
        <div className="flex flex-col items-center justify-center py-10">
          <svg className="w-12 h-12 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5h6" /></svg>
          
          {profile.role === 'abogado' ? (
            // Vista de Abogado
            <>
              <p className="text-lg text-gray-400 mb-6">Actualmente, no hay casos públicos que coincidan con tus especialidades.</p>
              <p className="text-sm text-gray-500 mb-6">Puedes revisar tu perfil o especialidades para ampliar tus opciones.</p>
              <a href="#0" className="btn bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg">
                Revisar Perfil
              </a>
            </>
          ) : (
            // Vista de Cliente
            <>
              <p className="text-lg text-gray-400 mb-6">No tienes solicitudes de casos en proceso.</p>
              <a href="#0" className="btn bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg">
                + Crear Nuevo Caso
              </a>
            </>
          )}
        </div>
      </div>
      
      {/* 5. Casos Cerrados (Se mantiene simple) */}
      <div className="mt-8 rounded-2xl border border-gray-800/50 bg-gray-900/50 p-8 shadow-lg">
         <h2 className="text-2xl font-semibold text-gray-200 mb-6 border-b border-gray-700/50 pb-4 text-left">Historial de Casos</h2>
         <p className="text-gray-400 py-10">No tienes registros de casos cerrados.</p>
      </div>

    </section>
  );
}