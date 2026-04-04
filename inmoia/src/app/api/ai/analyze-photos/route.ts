import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const MODEL = "claude-sonnet-4-20250514";

export type AnalyzePhotosResult = {
  type: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  amenities: string[];
  finishes: string;
  condition: string;
  estimated_price_min: number | null;
  estimated_price_max: number | null;
  title_es: string;
  title_en: string;
  desc_es: string;
  desc_en: string;
  desc_whatsapp_es: string;
  desc_instagram_es: string;
  ai_score: number;
  confidence: number;
};

type RequestPayload = {
  photoUrls: string[];
  city?: string;
  operation?: string;
};

function localFallback(): AnalyzePhotosResult {
  return {
    type: "casa",
    bedrooms: 3,
    bathrooms: 2,
    parking: 1,
    amenities: [],
    finishes: "Estándar",
    condition: "Buenas condiciones",
    estimated_price_min: null,
    estimated_price_max: null,
    title_es: "Propiedad residencial",
    title_en: "Residential property",
    desc_es: "Hermosa propiedad en excelentes condiciones. Espacios amplios y bien iluminados. Ideal para familia.",
    desc_en: "Beautiful property in excellent condition. Spacious, well-lit spaces. Ideal for families.",
    desc_whatsapp_es: "🏡 Propiedad en venta. Excelentes condiciones. Escríbenos para más info.",
    desc_instagram_es: "🏡✨ Nueva propiedad disponible. Espacios únicos para tu familia. DM para informes.",
    ai_score: 50,
    confidence: 0,
  };
}

function parseAnalysis(raw: string): AnalyzePhotosResult | null {
  const trimmed = raw.trim();
  try {
    return JSON.parse(trimmed) as AnalyzePhotosResult;
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start === -1 || end <= start) return null;
    try {
      return JSON.parse(trimmed.slice(start, end + 1)) as AnalyzePhotosResult;
    } catch {
      return null;
    }
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({})) as RequestPayload;
  const { photoUrls = [], city = "", operation = "sale" } = body;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || photoUrls.length === 0) {
    return NextResponse.json({
      ok: true,
      source: "fallback",
      fallback_reason: !apiKey ? "missing_api_key" : "no_photos",
      ...localFallback(),
    });
  }

  try {
    const client = new Anthropic({ apiKey });

    // Construir el contenido con las imágenes (máx 5)
    const imageContent: Anthropic.ImageBlockParam[] = photoUrls.slice(0, 5).map((url) => ({
      type: "image",
      source: { type: "url", url },
    }));

    const result = await client.messages.create({
      model: MODEL,
      max_tokens: 1200,
      system: `Eres un experto en bienes raíces mexicanos con visión artificial.
Analiza las fotos de esta propiedad y extrae información precisa.
Responde ÚNICAMENTE con JSON válido, sin markdown, sin explicaciones.`,
      messages: [
        {
          role: "user",
          content: [
            ...imageContent,
            {
              type: "text",
              text: `Analiza estas fotos de una propiedad en ${city || "México"} (operación: ${operation === "rent" ? "renta" : "venta"}).

Responde SOLO con este JSON (sin markdown):
{
  "type": "casa|depto|terreno|local|oficina|bodega",
  "bedrooms": número,
  "bathrooms": número (puede ser decimal ej: 2.5),
  "parking": número,
  "amenities": ["alberca","jardín","terraza","gym","seguridad",...],
  "finishes": "Básico|Estándar|Premium|Lujo",
  "condition": "descripción breve del estado",
  "estimated_price_min": número en MXN o null,
  "estimated_price_max": número en MXN o null,
  "title_es": "título comercial en español máx 70 chars",
  "title_en": "commercial title in English max 70 chars",
  "desc_es": "descripción portal en español 300-500 chars profesional",
  "desc_en": "portal description in English 300-500 chars professional",
  "desc_whatsapp_es": "versión corta con emojis para WA en español máx 200 chars",
  "desc_instagram_es": "caption Instagram con emojis en español máx 150 chars",
  "ai_score": número 0-100 (atractivo comercial),
  "confidence": número 0-1 (confianza del análisis)
}`,
            },
          ],
        },
      ],
    });

    const text = result.content
      .filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("\n");

    const parsed = parseAnalysis(text);
    if (!parsed) {
      return NextResponse.json({ ok: true, source: "fallback", fallback_reason: "invalid_json", ...localFallback() });
    }

    return NextResponse.json({ ok: true, source: "claude_vision", ...parsed });
  } catch {
    return NextResponse.json({ ok: true, source: "fallback", fallback_reason: "api_error", ...localFallback() });
  }
}
