// --- CÓDIGO COMPLETO Y FINAL DE LA PÁGINA DE REGISTRO DE ABOGADO (CON FIXES DE TS) ---

"use client";

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

// --- DEFINICIONES DE DATOS: CONSTANTES ---
const COLOMBIAN_CITIES = [
  'Bogotá D.C.', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Cúcuta', 
  'Bucaramanga', 'Pereira', 'Santa Marta', 'Manizales', 'Neiva'
];

const LEGAL_SPECIALTIES_DATA = [
  { name: "1. Derecho Público", key: "publico", subs: ["Constitucional", "Administrativo", "Electoral", "Tributario o Fiscal", "Urbanístico", "Ambiental Público", "Función Pública", "Contratación Estatal", "Municipal y Territorial", "Minero-Energético (Estatal)"] },
  { name: "2. Derecho Privado", key: "privado", subs: ["Civil (Rama madre)", "Contratos", "Responsabilidad Civil", "Bienes", "Sucesiones y Familia", "Obligaciones", "Comercial o Mercantil", "Sociedades", "Títulos Valores", "Contratos Mercantiles", "Derecho Concursal", "Derecho Bancario", "Propiedad Industrial y Competencia", "Inmobiliario y Notarial"] },
  { name: "3. Derecho Penal", key: "penal", subs: ["Penal General y Especial", "Procesal Penal", "Penal Económico y Empresarial", "Penal Internacional", "Penitenciario y Ejecución de Penas", "Criminología y Política Criminal", "Menores Infractores (RPA)"] },
  { name: "4. Derecho Laboral y S. Social", key: "laboral", subs: ["Individual del Trabajo", "Colectivo del Trabajo", "Procesal Laboral", "Seguridad Social", "Pensional y Riesgos Laborales"] },
  { name: "5. Derecho Económico y Empresarial", key: "economico", subs: ["Económico", "Financiero y Bursátil", "Bancario", "Competencia y Consumo", "Empresa y Emprendimiento", "Aduanero y Cambiario", "Tributario Empresarial", "Comercio Internacional"] },
  { name: "6. Derecho Internacional", key: "internacional", subs: ["Internacional Público", "Internacional Privado", "Internacional Humanitario", "Derechos Humanos", "Diplomático y Consular", "Migratorio"] },
  { name: "7. Derecho Procesal", key: "procesal", subs: ["Procesal Civil", "Procesal Penal", "Procesal Administrativo", "Procesal Laboral", "Procesal Constitucional", "Derecho Probatorio", "Arbitraje y Conciliación"] },
  { name: "8. Derecho Social y de Interés Público", key: "social", subs: ["De Familia", "Infancia y Adolescencia", "Género y Diversidad", "Salud y Bioética Jurídica", "Rural y Agrario", "Indígena y Pluralismo Jurídico", "Comunitario (CAN, MERCOSUR)"] },
  { name: "9. Derecho Ambiental y Energético", key: "ambiental", subs: ["Ambiental General", "Recursos Naturales", "Minero-Energético", "Cambio Climático"] },
  { name: "10. Derecho Militar y de Policía", key: "militar", subs: ["Penal Militar", "Disciplinario", "Operacional Militar", "Internacional Humanitario (Fuerzas Armadas)"] },
  { name: "11. Derecho de la Tecnología y Datos", key: "tecnologia", subs: ["Informático", "Digital", "Protección de Datos Personales (Habeas Data)", "Ciberseguridad", "Inteligencia Artificial"] },
  { name: "12. Otras Especializaciones", key: "otros", subs: ["Médico y Sanitario", "Deportivo", "Marítimo", "Derecho Animal", "Compliance"] },
];
// --- FIN DE DEFINICIONES DE DATOS ---

// --- MODAL DE TÉRMINOS Y CONDICIONES (Contenido y Componente) ---
const TERMS_AND_CONDITIONS_ES = [
  { title: "1. Aceptación de los Términos", content: "Bienvenido a KippiLex. Al acceder o utilizar nuestra plataforma, usted acepta cumplir con estos Términos y Condiciones. (Verificación: Leyes de Colombia/Jurisdicción: Bogotá)." },
  { title: "2. Definiciones", content: "Plataforma: KippiLex y sus servicios asociados. Abogado: Profesional del derecho registrado en la plataforma. Cliente: Persona que utiliza la plataforma para buscar servicios legales." },
  { title: "3. Descripción del Servicio", content: "KippiLex es un canal tecnológico para facilitar la conexión entre usuarios y abogados. KippiLex no interviene en la relación contractual, económica ni comunicacional." },
  { title: "4. Requisitos para Abogados", content: "Deben estar matriculados y habilitados para ejercer en su jurisdicción. KippiLex valida credenciales mediante consultas a fuentes públicas. Verificar su identidad con Cédula. Los abogados se comprometen a mantener su información profesional actualizada. Para Clientes: Deben proporcionar información veraz al registrarse. Está prohibido usar identidades falsas o suplantar a terceros." },
  { title: "7. Protección de Datos", content: "La plataforma cumple con la Ley de Protección de Datos Personales de Colombia. Sus datos se almacenan en servidores seguros con cifrado." },
  { title: "9. Limitación de Responsabilidad", content: "KippiLex es una plataforma tecnológica que actúa exclusivamente como intermediaria. Los abogados registrados prestan sus servicios de manera independiente y autónoma. KippiLex no garantiza resultados ni se responsabiliza por perjuicios derivados del vínculo cliente-abogado. Los resúmenes generados por IA son de carácter informativo y no constituyen asesoramiento legal." },
  { title: "10. Tarifas y Pagos", content: "Para Clientes: El uso de la plataforma es 100% gratuito. Para Abogados: El acceso a las funcionalidades será gratuito en una versión limitada. Existen versiones pagas bajo la modalidad de suscripción mensual. El pago se realiza a través de la plataforma MercadoPago. El abogado puede cancelar su suscripción en cualquier momento." },
  { title: "13. Jurisdicción y Ley Aplicable", content: "Estos términos se rigen por las leyes de la República de Colombia. Cualquier controversia será sometida a los tribunales ordinarios con jurisdicción en la ciudad de Bogotá, renunciando a cualquier otro fuero." },
  { title: "17. Contacto", content: "Para cualquier consulta, comuníquese con KippiLex a través de kippilex@gmail.com." },
];

// --- CORRECCIÓN DE TYPESCRIPT 1: Tipado explícito de props ---
const TermsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-950/75 backdrop-blur-sm transition-opacity">
      <div className="mx-auto flex h-full w-full max-w-2xl items-center justify-center p-4">
        <div className="relative w-full rounded-2xl bg-gray-800 p-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-700 pb-3">
            <h3 className="text-xl font-bold text-gray-100">Términos y Condiciones</h3>
            <button onClick={onClose} className="rounded-full p-2 text-gray-400 transition hover:bg-gray-700 hover:text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="mt-4 max-h-96 space-y-4 overflow-y-scroll pr-4 text-sm text-indigo-200/65">
            {TERMS_AND_CONDITIONS_ES.map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold text-indigo-400">{section.title}</h4>
                <p>{section.content}</p>
              </div>
            ))}
          </div>
          <button
            onClick={onClose}
            className="btn-sm mt-6 w-full bg-linear-to-t from-indigo-600 to-indigo-500 text-white shadow-lg"
          >
            Cerrar y Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};
// --- FIN DEL MODAL ---


export default function LawyerRegistrationForm() {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '', // Eliminamos tus datos personales del código
    apellido: '',
    genero: '',
    fechaNacimiento: '',
    whatsapp: '',
    ciudad: '', 
    cedula: '', 
    tarjetaProfesional: '', 
    // --- CORRECCIÓN DE TYPESCRIPT 2: Tipado de array 'never' ---
    especialidades: [] as string[],
    aceptaTerminos: false,
    documento: null as File | null,
  });

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(''); 
  const supabase = createClient();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [openCategory, setOpenCategory] = useState('');

  // Lógica para obtener el nombre de Google (se mantiene simplificada)
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
  }, [supabase]); // Dependencia corregida

  // --- CORRECCIÓN DE TYPESCRIPT 3: Tipado de 'checked' ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // Corregimos el error extrayendo 'checked' solo si el elemento es un HTMLInputElement
    const checked = (e.target as HTMLInputElement).checked; 

    if (type === 'file') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: target.files ? target.files[0] : null }));
    } else {
      // Usamos el valor de checked SOLO si el tipo es checkbox
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };
  // --- FIN DE CORRECCIÓN 3 ---

  const handleCheckboxChange = (subspecName: string) => {
    const isSelected = formData.especialidades.includes(subspecName);
    let newEspecialidades;

    if (isSelected) {
      newEspecialidades = formData.especialidades.filter(s => s !== subspecName);
    } else {
      newEspecialidades = [...formData.especialidades, subspecName];
    }
    setFormData(prev => ({ ...prev, especialidades: newEspecialidades }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError(''); // Limpiar errores

    // --- VALIDACIÓN ---
    if (formData.especialidades.length === 0) {
        setFormError('Por favor, selecciona al menos una especialidad.');
        setLoading(false); return;
    }
    if (!/^\d{10,}$/.test(formData.whatsapp)) {
        setFormError('El Número WhatsApp no es válido (solo números, mínimo 10 dígitos).');
        setLoading(false); return;
    }
    if (!/^\d{8,10}$/.test(formData.cedula)) {
        setFormError('El Número de Cédula no es válido (solo números, 8 a 10 dígitos).');
        setLoading(false); return;
    }
    if (!formData.documento) {
        setFormError('Por favor, sube el archivo de verificación (PDF).');
        setLoading(false); return;
    }
    // --- FIN VALIDACIÓN ---


    // 1. OBTENER USUARIO Y ARCHIVO
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    const file = formData.documento;
    
    if (userError || !user || !file) {
        setFormError("Error crítico de sesión o archivo.");
        setLoading(false);
        return;
    }

    // 2. LÓGICA DE SUBIDA DE ARCHIVOS
    const fileName = `${user.id}/${Date.now()}_documentos.pdf`; 
    
    const { error: uploadError } = await supabase.storage
        .from('documentos-abogados')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
        console.error('Error de Subida:', uploadError);
        setFormError(`Error al subir el archivo: ${uploadError.message}. Verifica las políticas de RLS del bucket.`);
        setLoading(false);
        return;
    }

    const { data: fileUrlData } = supabase.storage
        .from('documentos-abogados')
        .getPublicUrl(fileName);
    const fileUrl = fileUrlData.publicUrl;


    // 3. LÓGICA DE ACTUALIZACIÓN DEL PERFIL EN LA BD
    const { error: updateError } = await supabase
        .from('profiles')
        .update({
            nombre: formData.nombre,
            apellido: formData.apellido,
            fecha_nacimiento: formData.fechaNacimiento,
            genero: formData.genero,
            whatsapp: formData.whatsapp,
            ciudad: formData.ciudad,
            cedula: formData.cedula,
            tarjeta_profesional: formData.tarjetaProfesional,
            especialidades: formData.especialidades,
            documento_verificacion_url: fileUrl, 
            status: 'pending_verification', // Nuevo estado
        })
        .eq('id', user.id);

    setLoading(false);
    
    if (!updateError) {
      // ÉXITO: Redirigir al Dashboard (que tiene el banner)
      router.push('/dashboard');
    } else {
        setFormError('Error al guardar datos finales. Revisa la consola.');
        console.error('Error de BD al actualizar perfil:', updateError);
    }
  };
  
  // --- LÓGICA DE FILTRADO (Implementación del Acordeón) ---
  const filteredData = useMemo(() => {
    if (!searchTerm) return LEGAL_SPECIALTIES_DATA;

    const lowerCaseSearch = searchTerm.toLowerCase();

    return LEGAL_SPECIALTIES_DATA.map(category => ({
      ...category,
      // Filtramos las subespecialidades que coinciden con el término de búsqueda
      subs: category.subs.filter(sub => 
        sub.toLowerCase().includes(lowerCaseSearch)
      )
    })).filter(category => category.subs.length > 0);
  }, [searchTerm]);


  return (
    <section className="bg-gray-950">
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          <div className="pb-12 text-center">
            <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300))] bg-[length:200%_auto] bg-clip-text pb-5 font-nacelle text-4xl font-semibold text-transparent md:text-5xl">
              Completa tu perfil de Abogado
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="relative rounded-2xl bg-gray-900/50 p-8 shadow-2xl backdrop-blur-sm">
            
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
              
              {/* Género y Fecha de Nacimiento */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-indigo-200/65" htmlFor="genero">Género</label>
                <select id="genero" name="genero" value={formData.genero} onChange={handleInputChange} className="form-select w-full" required>
                  <option value="">Selecciona el género</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-sm font-medium text-indigo-200/65" htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
                <input id="fechaNacimiento" type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleInputChange} className="form-input w-full" required />
              </div>

              {/* WhatsApp y Ciudad */}
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
            
            {/* Sección 2: Información Profesional */}
            <div className="flex items-center gap-2 mb-6">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-sm font-bold text-white">2</span>
              <h2 className="text-xl font-semibold text-gray-200">Información Profesional</h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <label className="text-sm font-medium text-indigo-200/65" htmlFor="cedula">Número de Cédula</label>
                <input id="cedula" type="text" name="cedula" value={formData.cedula} onChange={handleInputChange} className="form-input w-full" placeholder="Ej: 1000000000 Sin puntos o comas" required />
              </div>
              <div className="space-y-4">
                <label className="text-sm font-medium text-indigo-200/65" htmlFor="tarjetaProfesional">Número de Tarjeta Profesional</label>
                <input id="tarjetaProfesional" type="text" name="tarjetaProfesional" value={formData.tarjetaProfesional} onChange={handleInputChange} className="form-input w-full" placeholder="Ej: 123456" required />
              </div>
            </div>

            {/* Especialidades Legales */}
            <h3 className="mt-8 mb-4 text-lg font-medium text-gray-200">Especialidades Legales</h3>
            <p className="mb-6 text-sm text-indigo-200/65">Las notificaciones de nuevos casos se enviarán de acuerdo a las especialidades que selecciones.</p>

            {/* --- ACORDEÓN DE ESPECIALIDADES --- */}
            
            {/* Barra de Búsqueda */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Buscar subespecialidad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input w-full"
              />
            </div>
            
            {/* Acordeón de Especialidades */}
            <div className="space-y-3">
              {filteredData.map((category) => (
                <div key={category.key} className="rounded-lg border border-gray-800 bg-gray-800/40">
                  {/* Título (Click para desplegar) */}
                  <button
                    type="button"
                    onClick={() => setOpenCategory(openCategory === category.key ? '' : category.key)}
                    className="flex w-full items-center justify-between p-4 text-left"
                  >
                    <span className="text-base font-semibold text-gray-200">{category.name} ({category.subs.length})</span>
                    <svg className={`h-5 w-5 transition-transform ${openCategory === category.key ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  
                  {/* Contenido Desplegable (Subespecialidades) */}
                  {openCategory === category.key && (
                    <div className="grid grid-cols-2 gap-4 border-t border-gray-800/70 p-4 md:grid-cols-3">
                      {category.subs.map((subspec) => (
                        <div key={subspec} className="flex items-center">
                          <input
                            id={subspec}
                            type="checkbox"
                            value={subspec}
                            checked={formData.especialidades.includes(subspec)}
                            onChange={() => handleCheckboxChange(subspec)}
                            className="form-checkbox text-indigo-500"
                          />
                          <label htmlFor={subspec} className="ml-2 text-sm text-indigo-200/65">{subspec}</label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {/* Contenedor de las Especialidades Seleccionadas (para verificación) */}
              <div className="pt-4 text-xs text-indigo-200/65">
                Seleccionadas: {formData.especialidades.join(', ') || 'Ninguna'}
              </div>
            </div>
            {/* --- FIN DE ACORDEÓN DE ESPECIALIDADES --- */}

            <hr className="my-10 border-gray-700/50" />

            {/* Sección 3: Verificación de Identidad */}
            <div className="flex items-center gap-2 mb-6">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-sm font-bold text-white">3</span>
              <h2 className="text-xl font-semibold text-gray-200">Verificación de Identidad</h2>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium text-indigo-200/65" htmlFor="documentUpload">
                Subir documentos (PDF)
              </label>
              <p className="text-xs text-red-400">Debe subir UN SOLO archivo PDF que contenga:</p>
              <ul className="ml-5 list-disc text-xs text-indigo-200/65">
                <li>Una selfie sosteniendo la cédula.</li>
                <li>Una foto de la cédula (cédula de ciudadanía) por el lado frontal.</li>
                <li>Una foto de la cédula (cédula de ciudadanía) por el lado posterior.</li>
              </ul>
              
              {/* NOTE: File upload logic requires special handling (Supabase Storage) */}
              <input id="documentUpload" type="file" name="documento" accept=".pdf" onChange={handleInputChange} className="form-input w-full" required />
            </div>

            <hr className="my-10 border-gray-700/50" />
            
            {/* Términos y Botón Final */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center">
                <input id="terms" type="checkbox" name="aceptaTerminos" checked={formData.aceptaTerminos} onChange={handleInputChange} className="form-checkbox text-indigo-500" required />
                <label htmlFor="terms" className="ml-2 text-sm text-indigo-200/65">
                  Acepto los{" "}
                  <button type="button" onClick={() => setIsTermsOpen(true)} className="text-indigo-400 hover:underline">
                    Términos y Condiciones
                  </button>
                </label>
              </div>
              
              {/* Mensaje de Error de Formulario */}
              {formError && (
                  <p className="mt-4 text-center text-red-400 text-sm font-medium">{formError}</p>
              )}

              <button type="submit" disabled={loading} className="btn w-full max-w-sm bg-linear-to-t from-indigo-600 to-indigo-500 text-white shadow-lg disabled:opacity-50">
                {loading ? 'Completando Registro...' : 'Completar Registro'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}