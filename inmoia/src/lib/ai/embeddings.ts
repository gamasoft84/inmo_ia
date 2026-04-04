import crypto from "node:crypto";
import { embed } from "ai";
import { openai } from "@ai-sdk/openai";

// Fallback determinístico cuando no hay OPENAI_API_KEY.
// Mantiene el pipeline pgvector funcional en entornos sin clave configurada.
function mockEmbedding(text: string): number[] {
  const digest = crypto.createHash("sha256").update(text).digest();
  const vector = new Array<number>(1536);
  for (let i = 0; i < 1536; i++) {
    vector[i] = (digest[i % digest.length] / 255) * 2 - 1;
  }
  return vector;
}

/**
 * Genera un embedding real con text-embedding-3-small (1536 dims).
 * Si OPENAI_API_KEY no está configurada, regresa un vector determinístico
 * como fallback para no romper el pipeline en desarrollo.
 */
export async function createEmbedding(text: string): Promise<number[]> {
  if (!process.env.OPENAI_API_KEY) {
    return mockEmbedding(text);
  }

  try {
    const { embedding } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: text,
    });
    return embedding;
  } catch {
    return mockEmbedding(text);
  }
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

export function toPgVectorLiteral(vector: number[]): string {
  return `[${vector.map((v) => v.toFixed(8)).join(",")}]`;
}
