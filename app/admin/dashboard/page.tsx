import AdminAuthGuard from './AdminAuthGuard';
import VerificationList from './_components/VerificationList'; 
import { createSupabaseServerClient } from '@/utils/supabase/server';

// Define el tipo para la lista
interface LawyerProfile {
    id: string;
    nombre: string;
    apellido: string;
    document_url?: string; 
}

// Fetch asincrónico dentro del contenido
async function DashboardContent() {

    const supabase = createSupabaseServerClient();

    // FIX: Quitamos "email" porque NO existe en profiles
    const { data: pendingLawyers, error } = await supabase
        .from('profiles')
        .select('id, nombre, apellido') 
        .eq('role', 'abogado')
        .eq('status', 'pending_verification')
        .returns<LawyerProfile[]>();

    if (error) {
        console.error("Error fetching pending lawyers:", error);
        return (
            <div className="p-8">
                <h1 className="text-3xl font-bold text-red-500">
                    Error al cargar la lista.
                </h1>
            </div>
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

export default function AdminDashboardPage() {
    return (
        <AdminAuthGuard>
            <DashboardContent /> 
        </AdminAuthGuard>
    );
}
