import { createMockEmbedding, cosineSimilarity } from "@/lib/ai/embeddings";
import { generateBotReply } from "@/lib/ai/claude";

type BotInput = {
  from: string;
  body: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
};

type Temp = "hot" | "warm" | "cold";

const CATALOG = [
  { id: "casa-coyoacan", title: "Casa Coyoacan", price: 5800000, city: "CDMX", features: "3 recamaras, jardin, 210m2" },
  { id: "depto-santa-fe", title: "Depto Santa Fe", price: 4450000, city: "CDMX", features: "2 recamaras, amenidades" },
  { id: "terreno-huatulco", title: "Terreno Huatulco", price: 2800000, city: "Huatulco", features: "950m2, cerca de playa" },
];

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

function getTopMatches(query: string) {
  const queryEmbedding = createMockEmbedding(query);

  return CATALOG.map((property) => {
    const propertyEmbedding = createMockEmbedding(`${property.title} ${property.city} ${property.features}`);
    return {
      ...property,
      similarity: cosineSimilarity(queryEmbedding, propertyEmbedding),
    };
  })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 2);
}

export async function handleIncomingWhatsAppMessage(input: BotInput) {
  const language = detectLanguage(input.body);
  const lead = scoreLead(input.body);
  const matches = getTopMatches(input.body);

  const systemPrompt = `Eres Sofia, asistente inmobiliaria de InmoIA.\nIdioma: ${language}.\nTono: profesional y calido con emojis moderados.\nTu objetivo: resolver dudas, proponer propiedades y cerrar visita.`;

  const catalogContext = matches
    .map((property) => `- ${property.title} (${property.city}) · $${property.price.toLocaleString("es-MX")} · ${property.features}`)
    .join("\n");

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
    maxTokens: 280,
  });

  return {
    reply,
    language,
    leadScore: lead.score,
    leadTemp: lead.temp,
    matches,
  };
}
