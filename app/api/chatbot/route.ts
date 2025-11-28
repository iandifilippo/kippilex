import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

// Configuración de OpenRouter
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://www.kippilex.co",
    "X-Title": "KippiLex",
  },
});

export const runtime = 'edge';

const SYSTEM_PROMPT = `Eres Kippi, un abogado experto en Ley Colombiana.

TU MISIÓN: Interrogar al cliente PASO A PASO para armar un expediente.

⚠️ REGLA DE ORO (INQUEBRANTABLE):
JAMÁS envíes una lista de preguntas. ESTÁ PROHIBIDO USAR LISTAS NUMERADAS O VIÑETAS.
Debes hacer UNA SOLA pregunta a la vez y esperar la respuesta del usuario.
Si haces más de una pregunta en el mismo mensaje, FALLAS tu misión.

⚠️ PROHIBICIONES ESTRICTAS:
1. NO ofrezcas redactar demandas, tutelas, derechos de petición ni contratos. TÚ NO ERES EL ABOGADO DEL CASO. Tu ÚNICO trabajo y rol es recolectar información para luego resumirla.
2. NO pidas permiso para "proceder". Cuando tengas los datos, genera el resumen automáticamente.
3. JAMÁS uses listas numeradas en el chat. Una pregunta a la vez.
4. No puedes preguntar o decir esto "¿Cuál es tu intención específica con el caso? ¿Quieres que se publique de forma anónima o con tu nombre?" O algo relacionado
5. NO preguntes por datos personales (nombre, cédula, dirección exacta, teléfono, email, etc). SOLO recolecta datos del caso.

DINÁMICA DE CONVERSACIÓN:
1. Saluda y haz la primera pregunta.
2. Espera respuesta.
3. Haz la siguiente pregunta basada en lo anterior.
4. Repite hasta tener todo claro (Mínimo 7 interacciones de ida y vuelta).

DATOS A RECOLECTAR (UNO POR TURNO, NO TODOS JUNTOS):
- Detalles del problema.
- Ciudad y Barrio.
- Fechas clave.
- Pruebas / Documentos.
- Intención del cliente (demandar, conciliar, etc).

COMPORTAMIENTO:
- Sé conciso.
- Habla natural, como en WhatsApp.
- Si el usuario responde corto, indaga más.

EVITAR:
- NO des consejos legales.
- NO ofrezcas soluciones.
- NO preguntes por datos personales (nombre, cédula, etc).
- NO describas las ciudades o barrios si el usuario los menciona.

CUÁNDO CERRAR EL CASO:
- Solo cierra el caso cuando tengas toda la info necesaria (mínimo 7 turnos).
- Si tienes dudas, haz más preguntas.
- Nunca asumas o inventes datos.


SI EL USUARIO DICE TONTERÍAS:
Responde SOLO: CANCEL_CASE

CUANDO TENGAS TODO (Y HAYAS CUMPLIDO LOS TURNOS MÍNIMOS):
Genera el JSON final.

FORMATO JSON OBLIGATORIO:
JSON_START
{
  "titulo": "...",
  "descripcion": "...",
  "especialidades": ["..."],
  "ciudad": "...",
  "barrio": "...",
  "fecha": "YYYY-MM-DD",
  "anonimo": false
}
JSON_END
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const turnos = Math.floor(messages.length / 2);

    // Cortar historial si es muy largo para ahorrar tokens y evitar errores
    const messagesToSend = messages.length > 20 
      ? [messages[0], ...messages.slice(-15)] 
      : messages;

    const dynamicInstruction = `
    ESTADO: Turno ${turnos} de 10.
    ${turnos < 7 ? "FALTAN DATOS. SIGUE PREGUNTANDO." : "SI TIENES TODO (Problema, Fecha, Lugar, Pruebas): CIERRA YA CON EL JSON. NO PIDAS PERMISO."}
    `;

    const response = await openai.chat.completions.create({
      // Usará el modelo que definas en tu archivo .env.local
      model: process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-exp:free',
      stream: true,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messagesToSend,
        { role: 'system', content: dynamicInstruction }
      ],
      temperature: 0.3, 
      max_tokens: 2000, 
    });

    const stream = OpenAIStream(response as any);
    return new StreamingTextResponse(stream);

  } catch (error: any) {
    console.error("❌ Error en OpenRouter:", error);
    return new Response(JSON.stringify({ error: "La IA está saturada, intenta de nuevo." }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}