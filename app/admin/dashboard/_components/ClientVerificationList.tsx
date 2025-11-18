"use client";

import { useState } from 'react';
import { verifyLawyer } from '../../../actions/admin';
import { IoCheckmarkCircleOutline, IoCloseCircleOutline, IoDocumentOutline, IoClose } from "react-icons/io5";

interface Lawyer {
  id: string;
  displayName: string;
  avatar_url: string | null;
  storage_path: string | null;
  documento_verificacion_url: string | null;
  cedula: string | null;
  tarjeta_profesional: string | null;
  whatsapp: string | null;
  ciudad: string | null;
  especialidades: string[] | null;
}

export default function VerificationList({ pendingLawyers }: { pendingLawyers: Lawyer[] }) {
  const [selected, setSelected] = useState<Lawyer | null>(null);

  const handleVerify = async (id: string, status: 'verified' | 'rejected') => {
    await verifyLawyer(id, status);
    setSelected(null);
  };

  return (
    <>
      <div className="grid gap-6">
        {pendingLawyers.map((lawyer) => {
          const pdfUrl = lawyer.documento_verificacion_url || 
            (lawyer.storage_path 
              ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/documentos-abogados/${lawyer.storage_path}`
              : null);

          return (
            <div
              key={lawyer.id}
              className="flex items-center justify-between p-6 bg-gray-800/60 rounded-xl border border-gray-700 cursor-pointer hover:bg-gray-800 transition"
              onClick={() => setSelected(lawyer)}
            >
              <div className="flex items-center gap-6">
                {lawyer.avatar_url ? (
                  <img src={lawyer.avatar_url} alt="Avatar" className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-2xl font-bold text-gray-400">
                    {lawyer.displayName.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-bold text-white">{lawyer.displayName}</h3>
                  <p className="text-sm text-gray-400">ID: {lawyer.id.slice(0, 8)}...</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {pdfUrl ? (
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <IoDocumentOutline className="w-5 h-5" />
                    Ver Matrícula
                  </a>
                ) : (
                  <span className="text-red-400 font-medium">Sin PDF</span>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVerify(lawyer.id, 'verified');
                    }}
                    className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition"
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVerify(lawyer.id, 'rejected');
                    }}
                    className="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition"
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="max-w-2xl w-full rounded-2xl bg-gray-900 p-8 shadow-2xl relative">
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <IoClose className="w-8 h-8" />
            </button>

            <div className="flex items-center gap-6 mb-8">
              {selected.avatar_url ? (
                <img src={selected.avatar_url} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center text-4xl font-bold text-gray-400">
                  {selected.displayName.charAt(0)}
                </div>
              )}
              <div>
                <h2 className="text-3xl font-bold text-white">{selected.displayName}</h2>
                <p className="text-gray-400">ID: {selected.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 text-gray-300">
              <div><p className="font-semibold">Cédula</p><p>{selected.cedula || 'No proporcionada'}</p></div>
              <div><p className="font-semibold">Tarjeta Profesional</p><p>{selected.tarjeta_profesional || 'No proporcionada'}</p></div>
              <div><p className="font-semibold">WhatsApp</p><p>{selected.whatsapp || 'No proporcionado'}</p></div>
              <div><p className="font-semibold">Ciudad</p><p>{selected.ciudad || 'No proporcionada'}</p></div>
              <div className="col-span-2">
                <p className="font-semibold">Especialidades</p>
                <p>{selected.especialidades?.join(', ') || 'Ninguna'}</p>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={() => handleVerify(selected.id, 'rejected')}
                className="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition"
              >
                Rechazar
              </button>
              <button
                onClick={() => handleVerify(selected.id, 'verified')}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition"
              >
                Aprobar Abogado
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}