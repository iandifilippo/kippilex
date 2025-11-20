// RUTA: app/admin/dashboard/VerificationList.tsx (COMPLETO)

"use client";

import { useState } from "react";
import { verifyLawyer } from "@/app/actions/admin";
// import Image from "next/image"; // Comentado si no lo usas

interface Lawyer {
  id: string;
  nombre: string | null;
  apellido: string | null;
  whatsapp: string | null;
  ciudad: string | null;
  cedula: string | null;
  tarjeta_profesional: string | null;
  especialidades: string[] | null;
  documento_verificacion_url: string | null;
  verification_status: string | null;
}

export default function VerificationList({ lawyers }: { lawyers: Lawyer[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleVerify = async (id: string, status: "verified" | "rejected") => {
    setLoadingId(id);
    await verifyLawyer(id, status);
    // Recarga la página para refrescar la lista después de la acción
    window.location.reload(); 
  };

  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-bold mb-6">Solicitudes de Verificación</h1>

      {/* El mensaje es preciso porque lawyers solo contiene pendientes */}
      {lawyers.length === 0 && (
        <p className="text-gray-600">No hay abogados pendientes por verificar.</p>
      )}

      <div className="space-y-6">
        {lawyers.map((lawyer) => (
          <div
            key={lawyer.id}
            className="border border-gray-700 rounded-lg p-6 shadow-sm bg-gray-800 text-gray-100"
          >
            <h2 className="text-xl font-semibold mb-3">
              {lawyer.nombre} {lawyer.apellido}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <p><strong>WhatsApp:</strong> {lawyer.whatsapp}</p>
              <p><strong>Ciudad:</strong> {lawyer.ciudad}</p>
              <p><strong>Cédula:</strong> {lawyer.cedula}</p>
              <p><strong>Tarjeta profesional:</strong> {lawyer.tarjeta_profesional}</p>
              <p>
                <strong>Especialidades:</strong>{" "}
                {lawyer.especialidades?.join(", ") || "—"}
              </p>
            </div>

            <div className="mt-4">
              <strong>Documento de Verificación:</strong>
              <br />
              {lawyer.documento_verificacion_url ? (
                <a
                  href={lawyer.documento_verificacion_url}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  Ver documento
                </a>
              ) : (
                "No hay documento"
              )}
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={() => handleVerify(lawyer.id, "verified")}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                disabled={loadingId === lawyer.id}
              >
                {loadingId === lawyer.id ? "Procesando..." : "Aprobar"}
              </button>

              <button
                onClick={() => handleVerify(lawyer.id, "rejected")}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                disabled={loadingId === lawyer.id}
              >
                {loadingId === lawyer.id ? "Procesando..." : "Rechazar"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}