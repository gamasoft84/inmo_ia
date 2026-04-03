import { generateBotReply } from "@/lib/ai/claude";
import { findTopPropertyMatches } from "@/lib/whatsapp/semantic-properties";

type BotInput = {
  from: string;
  to?: string;
  body: string;
  agencyId?: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
};

type Temp = "hot" | "warm" | "cold";

function detectLanguage(text: string): "es" | "en" {
  const lower = text.toLowerCase();
  const enHints = ["price", "visit", "bedroom", "hello", "interested", "beach"]; 
  const hasEnglish = enHints.some((hint) => lower.includes(hint));
  return hasEnglish ? "en" : "es";
}

function scoreLead(text: string): { score: number; temp: Temp } {
  const lower = text.toLowerCase();
  let score = 20;

  if (/(\$|mxn|usd|millones|m\b|budget|presupuesto)/.test(lower)) score += 20;
  if (/(agendar|visita|mañana|jueves|today|tomorrow|visit)/.test(lower)) score += 20;
  if (/(este mes|urgente|asap|inmediato)/.test(lower)) score += 15;
  if (/(credito aprobado|cash|contado)/.test(lower)) score += 10;
  if (/(solo viendo|futuro|despues)/.test(lower)) score -= 15;

  score = Math.max(0, Math.min(100, score));

  if (score >= 75) return { score, temp: "hot" };
  if (score >= 40) return { score, temp: "warm" };
  return { score, temp: "cold" };
}

export async function handleIncomingWhatsAppMessage(input: BotInput) {
  const language = detectLanguage(input.body);
  const lead = scoreLead(input.body);
  const semantic = input.agencyId
    ? await findTopPropertyMatches({
      agencyId: input.agencyId,
      query: input.body,
      limit: 2,
    })
    : { matches: [], source: "fallback" as const };
  const matches = semantic.matches;

  const systemPrompt = `Eres Sofia, asistente inmobiliaria de InmoIA.
Idioma: ${language}.
Tono: profesional, cercano y directo.
Objetivo principal: cerrar visita o llamada de seguimiento.

Reglas estrictas:
- Responde en maximo 90 palabras.
- Usa maximo 1 emoji.
- No inventes propiedades fuera del catalogo proporcionado.
- Si no hay match exacto, ofrece la mejor alternativa y pide permiso para buscar mas opciones.
- Cierra siempre con una pregunta concreta para avanzar (ej. horario de visita, presupuesto final, zona exacta).
- Termina la respuesta sin frases incompletas ni cortes.
- Evita parrafos largos; usa 2-4 bullets solo cuando ayuden a decidir rapido.`;

  const catalogContext = matches.length > 0
    ? matches
      .map((property) => `- ${property.title} (${property.city}) · ${property.features}`)
      .join("\n")
    : "- Sin coincidencias semanticas disponibles por ahora.";

  const messages = [
    ...(input.history ?? []),
    {
      role: "user" as const,
      content: `Cliente: ${input.body}\n\nCatalogo sugerido:\n${catalogContext}`,
    },
  ];

  const reply = await generateBotReply({
    systemPrompt,
    messages,
    maxTokens: 220,
  });

  return {
    reply,
    language,
    leadScore: lead.score,
    leadTemp: lead.temp,
    matches,
    semanticSource: semantic.source,
  };
}
