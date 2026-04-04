import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const MODEL = "claude-sonnet-4-20250514";

type DescribePayload = {
  type?: string;
  operation?: string;
  city?: string;
  area_total?: string | number;
  bedrooms?: string | number;
  photos?: string;
};

function localFallback(payload: DescribePayload) {
  const city = payload.city?.trim() || "tu ciudad";
  const area = String(payload.area_total || "amplia");
  const beds = String(payload.bedrooms || "2");
  const type = (payload.type || "propiedad").toUpperCase();
  const operation = payload.operation === "rent" ? "renta" : "venta";

  return {
    title_es: `${type} en ${city}`,
    desc_es: `Propiedad en ${city} con ${area}m2 y ${beds} recamaras. Ideal para ${operation}. Contactanos para conocer disponibilidad y agendar visita.`,
  };
}

export async function POST(req: NextRequest) {
  const payload = (await req.json().catch(() => ({}))) as DescribePayload;
  const fallback = localFallback(payload);

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: true, source: "fallback", ...fallback });
  }

  try {
    const client = new Anthropic({ apiKey });
    const photoUrls = String(payload.photos || "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 5);

    const result = await client.messages.create({
      model: MODEL,
      max_tokens: 450,
      system:
        "Eres copywriter inmobiliario senior en Mexico. Responde en JSON valido con llaves title_es y desc_es. Sin markdown.",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Genera titulo y descripcion comercial en espanol para una propiedad con estos datos:\n- Tipo: ${payload.type || "propiedad"}\n- Operacion: ${payload.operation || "sale"}\n- Ciudad: ${payload.city || "N/A"}\n- Superficie: ${payload.area_total || "N/A"} m2\n- Recamaras: ${payload.bedrooms || "N/A"}\n- Fotos (URLs de referencia): ${photoUrls.length ? photoUrls.join(", ") : "N/A"}\n\nReglas:\n1) Titulo maximo 70 caracteres\n2) Descripcion entre 300 y 500 caracteres\n3) Tono profesional y persuasivo\n4) No inventes amenidades especificas que no esten dadas\n5) Responde SOLO JSON: {\"title_es\":\"...\",\"desc_es\":\"...\"}`,
            },
          ],
        },
      ],
    });

    const text = result.content
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("\n")
      .trim();

    const parsed = JSON.parse(text) as { title_es?: string; desc_es?: string };
    const title_es = (parsed.title_es || fallback.title_es).trim();
    const desc_es = (parsed.desc_es || fallback.desc_es).trim();

    return NextResponse.json({
      ok: true,
      source: "anthropic",
      title_es,
      desc_es,
    });
  } catch {
    return NextResponse.json({ ok: true, source: "fallback", ...fallback });
  }
}
