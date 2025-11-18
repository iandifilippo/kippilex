import AdminAuthGuard from './AdminAuthGuard'; // Asegúrate que la ruta sea correcta
import VerificationList from './_components/VerificationList'; 
import { createSupabaseServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

// Define el tipo para la lista
interface LawyerProfile {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    document_url?: string; 
}

// Hacemos el fetch de datos ASÍNCRONO aquí, dentro de la página,
// y usamos el guard para proteger el acceso.
async function DashboardContent() {
    // 1. OBTENER LISTA DE ABOGADOS PENDIENTES
    const supabase = createSupabaseServerClient(); // Ya no lleva await
    
    // La lógica de admin/no-admin debe estar en este fetch o en el guard.
    // Si ya pasaste el AdminAuthGuard, asumimos que tienes la cookie de admin.

    const { data: pendingLawyers, error } = await supabase
        .from('profiles')
        .select('id, nombre, apellido, email') 
        .eq('role', 'abogado')
        .eq('status', 'pending_verification') 
        .returns<LawyerProfile[]>();

    if (error) {
        console.error("Error fetching pending lawyers:", error);
        return (
            <div className="p-8"><h1 className="text-3xl font-bold text-red-500">Error al cargar la lista.</h1></div>
        );
    }
    
    return (
        <section className="mx-auto max-w-4xl px-4 sm:px-6 py-12 md:py-20">
            <h1 className="text-3xl font-bold text-gray-100 mb-8">
                Panel de Verificación de Abogados
            </h1>
            <VerificationList pendingLawyers={pendingLawyers || []} />
        </section>
    );
}

// Exportamos la página principal que envuelve el contenido con la protección.
export default function AdminDashboardPage() {
    return (
        <AdminAuthGuard>
            <DashboardContent /> 
        </AdminAuthGuard>
    );
}