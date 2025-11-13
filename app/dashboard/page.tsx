import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers'; 

// --- Componente para las Tarjetas de Estadísticas ---
const StatsCard = ({ title, value, unit, color }) => (
  <div className={`p-5 rounded-xl shadow-lg border ${color === 'blue' ? 'bg-indigo-500/10 border-indigo-400/30' : 'bg-gray-800/50 border-gray-700'}`}>
    <h3 className="text-3xl font-bold text-gray-100">{value}</h3>
    <p className="text-xs text-gray-400">{title}</p> 
    <p className="text-sm text-indigo-300 mt-2">{unit}</p>
  </div>
);

// --- FUNCIÓN HELPER PARA CREAR EL CLIENTE DE SERVIDOR (Integrado aquí) ---
const createSupabaseServerClient = () => {
    const cookieStore = cookies();
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get: (name: string) => cookieStore.get(name)?.value,
                set: (name: string, value: string, options) => cookieStore.set({ name, value, ...options }),
                remove: (name: string, options) => cookieStore.set({ name, value: '', ...options }),
            },
        }
    );
};


export default async function DashboardPage() {
  const supabase = createSupabaseServerClient(); // Usamos el cliente integrado
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
  const isVerificationPending = profile.status === 'pending_verification' && profile.role === 'abogado';


  // --- CONTENIDO CONDICIONAL POR ROL ---

  // A. DASHBOARD DEL ABOGADO (Incluye Pending/Activo)
  if (profile.role === 'abogado') {
    return (
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 md:py-20">
        
        {/* 1. ANUNCIO DE VERIFICACIÓN PENDIENTE (Banner Condicional) */}
        {isVerificationPending && (
          <div className="relative rounded-lg border border-yellow-500/50 bg-yellow-900/20 p-6 shadow-lg mb-8">
              <h3 className="text-xl font-semibold text-yellow-300 mb-2">
                  ¡Verificación Pendiente!
              </h3>
              <p className="text-sm text-yellow-200/80">
                  Puedes **ver las ofertas de casos disponibles** en el panel inferior, pero no podrás ofertar o contactar clientes hasta que tu cuenta sea activada.
              </p>
          </div>
        )}

        {/* 2. ENCABEZADO */}
        <h1 className="text-3xl font-bold text-gray-100 mb-8">
          Panel de Abogado {isVerificationPending ? '(En Revisión)' : '(Activo)'}
        </h1>
        
        {/* 3. Tarjetas de Estadísticas */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-10">
          <StatsCard title="Propuestas enviadas" value="0" unit="Este mes" color="purple" />
          <StatsCard title="Ofertas aceptadas" value="0" unit="Total de casos" color="blue" />
          <StatsCard title="Casos disponibles" value="0" unit="Aún sin ofertar" color="green" />
        </div>

        {/* 4. SECCIÓN DE CASOS DISPONIBLES */}
        <div className="rounded-2xl border border-gray-800/50 bg-gray-900/50 p-8 text-center shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-200 mb-6 border-b border-gray-700/50 pb-4 text-left">
            Casos Disponibles para Ofertar
          </h2>
          
          <div className="flex flex-col items-center justify-center py-10">
            <svg className="w-12 h-12 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5h6" /></svg>
            
            <p className="text-lg text-gray-400 mb-6">Actualmente, no hay casos públicos que coinciden con tus especialidades.</p>
            
            {isVerificationPending ? (
              <span className="text-red-400">🚨 La opción de ofertar está deshabilitada hasta completar la verificación.</span>
            ) : (
              <a href="#0" className="btn bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg">
                Ver Ofertas
              </a>
            )}
          </div>
        </div>
        
        {/* 5. Casos Cerrados */}
        <div className="mt-8 rounded-2xl border border-gray-800/50 bg-gray-900/50 p-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-200 mb-6 border-b border-gray-700/50 pb-4 text-left">Historial de Casos</h2>
          <p className="text-gray-400 py-10">No tienes registros de casos cerrados.</p>
        </div>
      </section>
    );
  }

  // B. DASHBOARD DEL CLIENTE (Si el rol es 'cliente')
  if (profile.role === 'cliente') {
    return (
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 md:py-20">
        <h1 className="text-3xl font-bold text-gray-100 mb-8">
          ¡Bienvenido, {fullName}!
        </h1>
        
        {/* Tarjetas de Estadísticas (Fila superior) */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-10">
          <StatsCard title="Propuestas recibidas" value="0" unit="Últimos 30 días" color="purple" />
          <StatsCard title="Mensajes sin leer" value="0" unit="Conversaciones activas" color="blue" />
          <StatsCard title="Propuestas sin revisar" value="0" unit="Casos activos" color="green" />
        </div>

        {/* Casos Abiertos (CTA) */}
        <div className="rounded-2xl border border-gray-800/50 bg-gray-900/50 p-8 text-center shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-200 mb-6 border-b border-gray-700/50 pb-4 text-left">Casos Abiertos (Tus Solicitudes)</h2>
          
          <div className="flex flex-col items-center justify-center py-10">
            <svg className="w-12 h-12 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5h6" /></svg>
            <p className="text-lg text-gray-400 mb-6">No tienes solicitudes de casos en proceso.</p>
            
            <a href="#0" className="btn bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg">
              + Crear Nuevo Caso
            </a>
          </div>
        </div>
        
        {/* Casos Cerrados */}
        <div className="mt-8 rounded-2xl border border-gray-800/50 bg-gray-900/50 p-8 shadow-lg">
           <h2 className="text-2xl font-semibold text-gray-200 mb-6 border-b border-gray-700/50 pb-4 text-left">Historial de Casos</h2>
           <p className="text-gray-400 py-10">No tienes registros de casos cerrados.</p>
        </div>
      </section>
    );
  }

  // C. FALLBACK
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 md:py-20">
        <h1 className="text-3xl font-bold text-gray-100">
            Error de Acceso
        </h1>
        <p className="text-lg text-gray-400 mt-4">
            No se pudo determinar tu rol. Por favor, intenta iniciar sesión de nuevo.
        </p>
    </section>
  );
}