// RUTA: app/casos/page.tsx
// ESTADO: CORREGIDO (con ciudades de Colombia y especialidades detalladas)

"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Importar Link para la navegación

// --- DATOS CORREGIDOS ---

// 1. Usamos la lista de ciudades principales de Colombia
const locations = [
  'Bogotá D.C.', 
  'Medellín', 
  'Cali', 
  'Barranquilla', 
  'Cartagena', 
  'Cúcuta', 
  'Bucaramanga', 
  'Pereira', 
  'Santa Marta', 
  'Manizales', 
  'Neiva'
];

// 2. Usamos la lista detallada de especialidades que proporcionaste
const categories = [
  "Constitucional", "Administrativo", "Electoral", "Tributario o Fiscal", "Urbanístico", 
  "Ambiental Público", "Función Pública", "Contratación Estatal", 
  "Municipal y Territorial", "Minero-Energético (Estatal)", "Civil", "Contratos", 
  "Responsabilidad civil", "Bienes", "Sucesiones y familia", "Obligaciones", 
  "Comercial o Mercantil", "Sociedades", "Títulos valores", "Contratos mercantiles", 
  "Concursal", "Bancario", "Propiedad industrial y competencia", "Inmobiliario y Notarial", 
  "Penal General y Especial", "Procesal Penal", "Penal Económico y Empresarial", 
  "Penal Internacional", "Penitenciario y de Ejecución de Penas", "Criminología y Política Criminal", 
  "Menores Infractores (RPA)", "Individual del Trabajo", "Colectivo del Trabajo", 
  "Procesal Laboral", "Seguridad Social", "Pensional y Riesgos Laborales", "Económico", 
  "Financiero y Bursátil", "Competencia y Consumo", "Empresa y Emprendimiento", 
  "Aduanero y Cambiario", "Tributario Empresarial", "Comercio Internacional", 
  "Internacional Público", "Internacional Privado", "Internacional Humanitario", 
  "Derechos Humanos", "Diplomático y Consular", "Migratorio", "Procesal Civil", 
  "Procesal Administrativo", "Procesal Constitucional", 
  "Probatorio", "Arbitraje y Conciliación (MASC)", "de Familia", "Infancia y Adolescencia", 
  "de Género y Diversidad", "a la Salud y Bioética Jurídica", "Rural y Agrario", 
  "Indígena y Pluralismo Jurídico", "Comunitario (CAN, MERCOSUR)", "Ambiental General", 
  "de los Recursos Naturales", "Minero-Energético", "Cambio Climático y Sostenibilidad", 
  "del Agua y del Territorio", "Penal Militar", "Disciplinario", "Operacional Militar", 
  "Internacional Humanitario aplicado a las Fuerzas Armadas", "Informático", "Digital", 
  "Protección de Datos Personales (Habeas Data)", "Ciberseguridad", 
  "Inteligencia Artificial", "Legaltech y Automatización Jurídica", 
  "dPropiedad Intelectual y del Software", "Médico y Sanitario", "Deportivo", 
  "Marítimo y Aeronáutico", "Educativo", "Cultural y del Patrimonio", 
  "dModa (Fashion Law)", "Animal y Ecológico", "Entretenimiento y de Medios", 
  "Responsabilidad del Estado", "Compliance y Ética Corporativa", "Cripto y Blockchain"
];
// --- FIN DE DATOS CORREGIDOS ---


export default function CasosPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const handleClearFilters = () => {
    setSelectedCategory('');
    setSelectedLocation('');
    // Aquí irá la lógica de filtrado de la IA
  };

  return (
<section className="bg-gray-950 text-gray-200 min-h-screen">
          {/* Mini-Header visible en esta página */}
      <div className="sticky top-0 z-40 bg-gray-950/90 backdrop-blur-sm shadow-md">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center" aria-label="KippiLex">
            <Image
              src="/images/kippilexlogo.png"
              width={32}
              height={32}
              alt="KippiLex Logo"
              className="mr-2"
            />
            <span className="text-xl font-bold text-gray-200">KippiLex</span>
          </Link>
          <Link href="/signin" className="btn-sm bg-indigo-600 hover:bg-indigo-700 text-white">
            Iniciar Sesión
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 md:py-12">
        {/* Barra de Búsqueda y Filtros */}
        <div className="mb-8 flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <div className="relative flex-grow w-full md:w-auto">
            <input
              type="text"
              placeholder="Buscar casos..."
              className="form-input w-full pl-10 pr-4 py-2 rounded-lg bg-gray-900 border-gray-700 text-gray-200 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
              aria-label="Buscar casos"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>

          <div className="flex items-center gap-3 relative w-full md:w-auto justify-end">
            {/* Casos sin oferta */}
            <button className="btn-sm flex items-center gap-2 rounded-full bg-indigo-600/20 text-indigo-300 hover:bg-indigo-700/30">
              <svg className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Casos sin oferta
            </button>

            {/* Botón de Filtros */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-sm flex items-center gap-2 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700/70"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6-6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
              Filtros
              <svg className={`h-3 w-3 transition-transform ${showFilters ? 'rotate-180' : 'rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>

            {/* Dropdown de Filtros */}
            {showFilters && (
              <div className="absolute top-full right-0 mt-2 w-72 origin-top-right rounded-xl bg-white p-4 shadow-lg text-gray-800 z-10">
                <div className="flex flex-col gap-4">
                  {/* Categoría */}
                  <div className="space-y-2">
                    <label htmlFor="category-filter" className="text-sm font-medium text-gray-700">Categoría</label>
                    <select
                      id="category-filter"
                      className="form-select w-full rounded-md border-gray-300 bg-gray-50 text-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">Todas las categorías</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Ubicación */}
                  <div className="space-y-2">
                    <label htmlFor="location-filter" className="text-sm font-medium text-gray-700">Ubicación</label>
                    <select
                      id="location-filter"
                      className="form-select w-full rounded-md border-gray-300 bg-gray-50 text-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                    >
                      <option value="">Toda Colombia</option>
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Limpiar Filtros */}
                  <button 
                    onClick={handleClearFilters}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700 text-left"
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Placeholder para la lista de Casos */}
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl mb-4">No hay casos disponibles en este momento.</p>
          <p className="text-md">Vuelve más tarde o ajusta tus filtros.</p>
          <div className="mt-8 flex justify-center">
             <svg className="h-20 w-20 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
        </div>

      </div>
    </section>
  );
}