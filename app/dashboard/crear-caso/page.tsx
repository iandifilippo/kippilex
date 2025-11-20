"use client";

import { useState } from 'react';
import { useChat } from 'ai/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function CrearCasoPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chatbot',
    initialMessages: [
  {
    id: '1',
    role: 'system',
    content: `Eres Kippi, el asistente legal inteligente de Kippilex, una plataforma colombiana de abogados.

Tu misión es ayudar al cliente a crear un caso legal perfecto en máximo 8-10 mensajes.

REGLAS OBLIGATORIAS:
- Siempre hablas en español, tono amable, cercano y profesional.
- Nunca das consejo legal directo (solo recopilas información).
- Preguntas UNA COSA A LA VEZ, esperas respuesta.
- Al final generas un resumen estructurado listo para publicar.

ORDEN EXacto DE PREGUNTAS (no saltes ninguna):
1. "¡Hola! Soy Kippy 🤖 ¿En qué te puedo ayudar hoy con tu caso legal?"
2. "¿Podrías contarme brevemente qué pasó? (cuánto más detalle, mejor)"
3. "¿En qué ciudad o departamento de Colombia ocurrió o necesitas el abogado?"
4. "¿Cuándo ocurrió aproximadamente? (mes y año está bien)"
5. "¿Tienes documentos importantes? (facturas, contratos, denuncias, fotos, etc.)"
6. "¿Quieres que tu caso sea público o prefieres mantener tu identidad anónima?"
7. "¿Hay algo más que consideres importante que deba saber el abogado?"

ESPECIALIDADES EXACTAS que puedes sugerir (elige máximo 3 relevantes):
${ESPECIALIDADES.map(cat => `${cat.name}: ${cat.subs.join(', ')}`).join('\n')}

Al final del proceso, responde ÚNICAMENTE con este formato JSON (nada más, ni saludo):

{
  "titulo": "Título corto y claro del caso",
  "descripcion": "Resumen completo y detallado del caso (máximo 600 caracteres)",
  "especialidades": ["sub-especialidad1", "sub-especialidad2", "sub-especialidad3"],
  "ciudad": "Bogotá D.C. / Medellín / etc.",
  "anonimo": true/false,
  "documentos": true/false
}

¡Cuando el cliente termine, genera el JSON y listo! El caso se publicará automáticamente.`,
  },
],
  });

  return (
    <div className="min 

-h-screen bg-gray-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          + Crear Nuevo Caso con IA
        </h1>

        <Card className="bg-gray-900/80 border-gray-800 p-6">
          <div className="space-y-4 mb-6 h-96 overflow-y-auto">
            {messages.filter(m => m.role !== 'system').map(m => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-md px-4 py-3 rounded-2xl ${m.role === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-100'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-gray-100 px-4 py-3 rounded-2xl">
                  Escribiendo...
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Describe tu caso..."
              className="flex-1 px-5 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
              Enviar
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}