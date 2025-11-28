"use client";

import { useState, useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Send, AlertCircle, XCircle } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';

export default function CrearCasoPage() {
  const router = useRouter();
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // === HOOK DEL CHAT ===
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chatbot',
    onError: (error) => {
      console.error("Error chat:", error);
      setErrorMsg("Error de conexión. Intenta de nuevo.");
      setIsProcessing(false);
    },
    onFinish: (message) => {
      if (message.role === 'assistant' && message.content.includes("JSON_START")) {
        // Ejecutamos el guardado de inmediato
        const content = message.content;
        handleFinishAndRedirect(content);
      }
    }
  });

  const interactionCount = Math.floor(messages.length / 2);
  const progressPercent = Math.min((interactionCount / 10) * 100, 100);

  // Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isProcessing]);

  // Auth
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push('/signin');
      else setUserId(user.id);
    };
    getUser();
  }, [supabase, router]);

  // Efecto visual de carga
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (isLoading && lastMessage?.role === 'assistant' && lastMessage.content.includes("JSON_START")) {
      setIsProcessing(true);
    }
  }, [messages, isLoading]);


  // === FUNCIÓN DE GUARDADO ===
  const handleFinishAndRedirect = async (fullContent: string) => {
    if (!userId) return;
    setIsProcessing(true);
    
    try {
      console.log("1. Procesando contenido...");

      // Extracción del JSON "A la fuerza"
      let caseData: any = {};
      
      try {
        const parts = fullContent.split("JSON_START");
        if (parts.length > 1) {
          let jsonPart = parts[1];
          if (jsonPart.includes("JSON_END")) {
            jsonPart = jsonPart.split("JSON_END")[0];
          }
          // Limpieza
          jsonPart = jsonPart.replace(/```json/g, '').replace(/```/g, '').trim();
          jsonPart = jsonPart.replace(/'([^']+)':/g, '"$1":'); 

          // Parseo
          try {
            caseData = JSON.parse(jsonPart);
          } catch {
            // eslint-disable-next-line no-eval
            caseData = eval('(' + jsonPart + ')');
          }
        }
      } catch (e) {
        console.warn("No se pudo parsear JSON, usando valores por defecto.");
      }

      console.log("2. Datos extraídos:", caseData);

      // Objeto listo para Supabase
      const payload = {
        cliente_id: userId,
        titulo: caseData.titulo || "Nuevo Caso",
        descripcion: caseData.descripcion || "Descripción pendiente de revisión.",
        especialidades: Array.isArray(caseData.especialidades) ? caseData.especialidades : [],
        ciudad: caseData.ciudad || 'Colombia',
        barrio: caseData.barrio || '',
        fecha_incidente: caseData.fecha || null,
        anonimo: caseData.anonimo || false,
        estado: 'borrador',
      };

      console.log("3. Enviando a Supabase...", payload);

      const { data, error } = await supabase.from('casos').insert(payload).select().single();

      if (error) {
        // AQUÍ ESTÁ LA ALERTA QUE TE DIRÁ LA VERDAD
        alert(`❌ ERROR DE BASE DE DATOS:\n${error.message}\n${error.details}`);
        throw error;
      }

      console.log("4. Éxito. ID:", data.id);
      
      // Redirección directa
      router.push(`/dashboard/crear-caso/resumen/${data.id}`);

    } catch (err: any) {
      console.error("ERROR FATAL:", err);
      setIsProcessing(false);
      setErrorMsg(`No se pudo guardar: ${err.message}`);
    }
  };

  // Ocultar JSON del chat visualmente
  const cleanContent = (text: string) => {
    if (text.includes("JSON_START")) {
      return text.split("JSON_START")[0].trim();
    }
    return text;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-85px)] bg-gray-950 px-4 py-4 overflow-hidden">
      <div className="w-full max-w-4xl h-full flex flex-col gap-4">
        
        {/* Header */}
        <div className="shrink-0 space-y-3">
          <div className="flex justify-between items-end px-2">
            <div>
              <h1 className="text-2xl font-bold text-white">Asistente Legal Kippi</h1>
              <p className="text-gray-400 text-xs">Kippi te hará preguntas clave para armar tu caso.</p>
            </div>
            <span className="text-purple-400 font-bold text-sm">
              Progreso {Math.min(interactionCount + 1, 10)} / 10
            </span>
          </div>
          <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
             <div 
               className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 transition-all duration-700 ease-out"
               style={{ width: `${progressPercent}%` }}
             />
          </div>
        </div>

        {/* Chat Card */}
        <Card className="flex-1 flex flex-col bg-gray-900/90 border-gray-800 shadow-2xl overflow-hidden rounded-2xl relative">
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
            
            <div className="flex justify-start">
              <div className="flex gap-4 max-w-[85%]">
                <div className="shrink-0 mt-1">
                  <Image src="/images/kippibot.jpg" width={36} height={36} alt="Kippi" className="rounded-full border border-gray-700 shadow-lg" />
                </div>
                <div className="bg-gray-800 p-4 rounded-2xl rounded-tl-none border border-gray-700 text-gray-200 shadow-md">
                   <p className="font-semibold text-purple-400 mb-2">Kippi IA</p>
                   <p>¡Hola! Soy Kippi 🤖. Descríbeme tu problema legal y yo redactaré tu expediente.</p>
                </div>
              </div>
            </div>

            {messages.map((m) => {
              const content = cleanContent(m.content);
              if (!content) return null;
              
              return (
                <div key={m.id} className={`flex w-full ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="shrink-0 mt-1">
                      {m.role === 'assistant' ? (
                        <Image src="/images/kippibot.jpg" width={32} height={32} alt="AI" className="rounded-full border border-gray-700" />
                      ) : (
                        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">TÚ</div>
                      )}
                    </div>
                    <div className={`
                      px-5 py-3 rounded-2xl shadow-md text-sm md:text-base leading-relaxed whitespace-pre-wrap
                      ${m.role === 'user' 
                        ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-tr-none' 
                        : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-none'}
                    `}>
                      {content}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* ERROR VISIBLE */}
            {errorMsg && (
              <div className="flex justify-center py-4">
                <div className="bg-red-900/50 text-red-200 px-4 py-3 rounded-xl border border-red-700 flex flex-col items-center gap-2 text-center shadow-lg max-w-md">
                  <div className="flex items-center gap-2 font-bold text-red-300">
                    <XCircle className="w-5 h-5" /> Hubo un error
                  </div>
                  <p className="text-sm">{errorMsg}</p>
                  <Button onClick={() => { setErrorMsg(null); setIsProcessing(false); }} variant="outline" size="sm" className="mt-2 border-red-500 text-red-300 hover:bg-red-900">
                    Cerrar aviso
                  </Button>
                </div>
              </div>
            )}

            {/* OVERLAY DE CARGA */}
            {isProcessing && (
               <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-md flex flex-col items-center justify-center z-50 animate-in fade-in duration-500">
                  <div className="w-20 h-20 border-4 border-purple-600 border-t-purple-300 rounded-full animate-spin mb-6"></div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Creando Resumen...</h3>
                  <p className="text-purple-200 mt-2 font-medium">No cierres esta página</p>
               </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-gray-900/95 border-t border-gray-800 shrink-0 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="relative flex items-end gap-2 max-w-4xl mx-auto">
              <TextareaAutosize
                minRows={1}
                maxRows={5}
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Escribe tu respuesta aquí..."
                className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all shadow-inner resize-none"
                disabled={isLoading || isProcessing}
                autoFocus
              />
              <Button 
                type="submit" 
                disabled={isLoading || !input.trim() || isProcessing}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl w-12 h-12 mb-[1px] shadow-lg flex-shrink-0"
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}