"use client";

import React, { useState } from 'react';
import { verifyLawyer } from '../../../actions/admin';
import { IoCheckmarkCircleOutline, IoCloseCircleOutline } from "react-icons/io5";
import { LawyerProfile } from '@/types/LawyerProfile';

// Props del componente
interface VerificationListProps {
    pendingLawyers: LawyerProfile[];
}

export default function VerificationList({ pendingLawyers }: VerificationListProps) {
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleVerify = async (lawyerId: string, status: 'verified' | 'rejected') => {
        setLoadingId(lawyerId);
        setStatusMessage(null);

        const result = await verifyLawyer(lawyerId, status);

        if (result.success) {
            setStatusMessage(`Éxito: ${result.message}`);
        } else {
            setStatusMessage(`Error: ${result.message}`);
        }

        setLoadingId(null);
    };

    if (!pendingLawyers || pendingLawyers.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500 rounded-lg border border-gray-800/50 bg-gray-900/50">
                ✅ No hay abogados pendientes de verificación.
            </div>
        );
    }

    return (
        <div className="p-4 rounded-lg border border-gray-800/50 bg-gray-900/50 shadow-xl">
            {statusMessage && (
                <div className={`p-3 mb-4 rounded ${statusMessage.startsWith('Éxito') ? 'bg-green-600/30 text-green-300' : 'bg-red-600/30 text-red-300'}`}>
                    {statusMessage}
                </div>
            )}

            <ul className="space-y-4">
                {pendingLawyers.map((lawyer) => (
                    <li key={lawyer.id} className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                        <div className="flex-1 min-w-0">
                            <p className="text-lg font-semibold text-gray-100">
                                {lawyer.nombre} {lawyer.apellido}
                            </p>
                            <p className="text-sm text-gray-400 truncate">
                                ID: {lawyer.id} | Email: {lawyer.email}
                            </p>
                        </div>

                        <div className="flex space-x-2 ml-4">
                            <button
                                onClick={() => handleVerify(lawyer.id, 'verified')}
                                disabled={loadingId === lawyer.id}
                                className="p-2 rounded-full text-green-400 hover:bg-green-700/30 disabled:opacity-50 transition"
                                title="Aprobar Abogado"
                            >
                                {loadingId === lawyer.id ? '...' : <IoCheckmarkCircleOutline className="w-6 h-6" />}
                            </button>

                            <button
                                onClick={() => handleVerify(lawyer.id, 'rejected')}
                                disabled={loadingId === lawyer.id}
                                className="p-2 rounded-full text-red-400 hover:bg-red-700/30 disabled:opacity-50 transition"
                                title="Rechazar Abogado"
                            >
                                {loadingId === lawyer.id ? '...' : <IoCloseCircleOutline className="w-6 h-6" />}
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
