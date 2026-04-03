import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-sonnet-4-20250514";

export type ClaudeMessage = {
  role: "user" | "assistant";
  content: string;
};

export type GenerateReplyInput = {
  systemPrompt: string;
  messages: ClaudeMessage[];
  maxTokens?: number;
};

function fallbackReply(lastUserMessage: string) {
  const lower = lastUserMessage.toLowerCase();

  if (lower.includes("precio") || lower.includes("cost") || lower.includes("budget")) {
    return "Con gusto. Tengo opciones dentro de tu rango. ¿Me compartes presupuesto aproximado y zona para proponerte alternativas concretas?";
  }

  if (lower.includes("visita") || lower.includes("visit")) {
    return "Perfecto, te ayudo a agendar visita. Tengo disponibilidad mañana 10am o jueves 3pm. ¿Cuál prefieres?";
  }

  return "¡Hola! Soy Sofía de InmoIA 🏡 Estoy para ayudarte con propiedades, precios y visitas. Cuéntame qué tipo de inmueble buscas y en qué zona.";
}

export async function generateBotReply(input: GenerateReplyInput): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const lastUserMessage = [...input.messages].reverse().find((m) => m.role === "user")?.content ?? "";

  if (!apiKey) {
    return fallbackReply(lastUserMessage);
  }

  const client = new Anthropic({ apiKey });

  const result = await client.messages.create({
    model: MODEL,
    max_tokens: input.maxTokens ?? 350,
    system: input.systemPrompt,
    messages: input.messages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
  });

  const textPart = result.content.find((part) => part.type === "text");
  return textPart?.text?.trim() || fallbackReply(lastUserMessage);
}
