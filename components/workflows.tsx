"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Workflows() {
  const [modo, setModo] = useState("clientes");

  const pasosClientes = [
    {
      titulo: "Describe tu caso",
      texto:
        "Responde unas simples preguntas para que nuestra IA entienda tu situación y el tipo de asesoría que necesitas.",
    },
    {
      titulo: "IA genera un resumen",
      texto:
        "KippiLex analiza tus respuestas, clasifica tu caso automáticamente y encuentra los abogados más adecuados.",
    },
    {
      titulo: "Recibe propuestas",
      texto:
        "Abogados especializados te enviarán propuestas personalizadas. Elige la que mejor se adapte a ti y empieza el proceso.",
    },
  ];

  const pasosAbogados = [
    {
      titulo: "Explora casos",
      texto:
        "Accede a un marketplace de casos legales según tu especialidad o recibe alertas personalizadas con nuevas oportunidades.",
    },
    {
      titulo: "Envía tu propuesta",
      texto:
        "Presenta tu estrategia legal con una propuesta clara, profesional y adaptada al cliente que la recibirá.",
    },
    {
      titulo: "Conecta directamente",
      texto:
        "Si aceptan tu propuesta, el cliente podrá contactarte directamente por WhatsApp para concretar los detalles.",
    },
  ];

  const pasos = modo === "clientes" ? pasosClientes : pasosAbogados;

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pb-12 md:pb-20 text-center">
          <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-gradient-to-r before:from-transparent before:to-indigo-200/50 after:h-px after:w-8 after:bg-gradient-to-l after:from-transparent after:to-indigo-200/50">
            <span className="inline-flex bg-gradient-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent">
              ¿Cómo funciona KippiLex?
            </span>
          </div>

          <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
            Todo comienza con un clic
          </h2>

          <div className="flex justify-center gap-4 mb-8">
            {["clientes", "abogados"].map((tipo) => (
              <motion.button
                key={tipo}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(99, 102, 241, 0.6)",
                }}
                whileTap={{ scale: 0.97 }}
                className={`px-6 py-2 rounded-full font-medium min-w-[150px] transition-all ${
                  modo === tipo
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
                onClick={() => setModo(tipo)}
              >
                {tipo === "clientes" ? "Para Clientes" : "Para Abogados"}
              </motion.button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {pasos.map((paso, index) => (
              <motion.div
                key={index}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(129, 140, 248, 0.5)",
                }}
                transition={{ duration: 0 }}
                className="rounded-2xl bg-gray-900/50 border border-gray-800 p-6 shadow-lg"
              >
                <div className="text-4xl font-bold text-indigo-400 mb-2">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-indigo-100">
                  {paso.titulo}
                </h3>
                <p className="text-indigo-200/70">{paso.texto}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
