import crypto from "node:crypto";

// Placeholder deterministic embedding until dedicated embedding model is wired.
// Keeps vector(1536) pipeline and pgvector queries testable in early phases.
export function createMockEmbedding(text: string): number[] {
  const digest = crypto.createHash("sha256").update(text).digest();
  const vector = new Array<number>(1536);

  for (let i = 0; i < 1536; i += 1) {
    const byte = digest[i % digest.length];
    vector[i] = (byte / 255) * 2 - 1;
  }

  return vector;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < Math.min(a.length, b.length); i += 1) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

export function toPgVectorLiteral(vector: number[]) {
  return `[${vector.map((value) => Number(value).toFixed(8)).join(",")}]`;
}
