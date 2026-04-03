import { createMockEmbedding, toPgVectorLiteral } from "@/lib/ai/embeddings";
import { createAdminClient } from "@/lib/supabase/admin";

type PropertyMatch = {
  id: string;
  title: string;
  city: string;
  features: string;
  similarity: number;
};

type MatchPropertiesInput = {
  agencyId: string;
  query: string;
  limit?: number;
};

type MatchPropertiesResult = {
  matches: PropertyMatch[];
  source: "pgvector" | "fallback";
};

const FALLBACK_CATALOG: PropertyMatch[] = [
  {
    id: "casa-coyoacan",
    title: "Casa Coyoacan",
    city: "CDMX",
    features: "3 recamaras, jardin, 210m2",
    similarity: 0,
  },
  {
    id: "depto-santa-fe",
    title: "Depto Santa Fe",
    city: "CDMX",
    features: "2 recamaras, amenidades",
    similarity: 0,
  },
  {
    id: "terreno-huatulco",
    title: "Terreno Huatulco",
    city: "Huatulco",
    features: "950m2, cerca de playa",
    similarity: 0,
  },
];

export async function findTopPropertyMatches(input: MatchPropertiesInput): Promise<MatchPropertiesResult> {
  const supabase = createAdminClient();
  if (!supabase) {
    return {
      matches: FALLBACK_CATALOG.slice(0, input.limit ?? 2),
      source: "fallback",
    };
  }

  const queryEmbedding = createMockEmbedding(input.query);
  const vectorLiteral = toPgVectorLiteral(queryEmbedding);

  const result = await supabase.rpc("match_properties", {
    p_agency_id: input.agencyId,
    p_query_embedding: vectorLiteral,
    p_match_count: input.limit ?? 2,
    p_status: null,
  });

  if (result.error) {
    return {
      matches: FALLBACK_CATALOG.slice(0, input.limit ?? 2),
      source: "fallback",
    };
  }

  const rows = (result.data ?? []) as Array<{
    id: string;
    title_es: string | null;
    city: string | null;
    features: string | null;
    similarity: number | null;
  }>;

  if (rows.length === 0) {
    return {
      matches: FALLBACK_CATALOG.slice(0, input.limit ?? 2),
      source: "fallback",
    };
  }

  return {
    source: "pgvector",
    matches: rows.map((row) => ({
      id: row.id,
      title: row.title_es?.trim() || "Propiedad sin titulo",
      city: row.city?.trim() || "Sin ciudad",
      features: row.features?.trim() || "Sin detalle",
      similarity: Number(row.similarity ?? 0),
    })),
  };
}
