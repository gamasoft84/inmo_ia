"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Chip } from "@/components/ui/Chip";

type TypeFilter = "all" | "casa" | "depto" | "terreno";

type PropertyItem = {
  id: string;
  slug: string;
  title: string;
  city: string;
  type: string;
  status: string;
  priceLabel: string;
  emoji: string;
};

type Row = Record<string, unknown>;

const statusClasses: Record<string, string> = {
  active: "bg-success-light text-success",
  draft: "bg-brand-light text-brand-dark",
  paused: "bg-brand-light text-brand-dark",
  sold: "bg-info-light text-info",
  rented: "bg-info-light text-info",
};

const typeEmoji: Record<string, string> = {
  casa: "🏡",
  depto: "🏢",
  terreno: "🌿",
  local: "🏬",
  oficina: "🏙️",
  bodega: "🏗️",
};

type SemanticResult = {
  id: string; slug: string; title: string; city: string;
  type: string; price_mxn: number | null; photo: string | null;
  status: string; similarity: number; features: string;
};

export default function PropiedadesPage() {
  const supabase = createClient();
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<TypeFilter>("all");
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [aiMode, setAiMode] = useState(false);
  const [aiResults, setAiResults] = useState<SemanticResult[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSource, setAiSource] = useState<"pgvector" | "fallback" | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const { data } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(60);

      if (!mounted) return;

      const mapped: PropertyItem[] = (data ?? []).map((raw) => {
        const p = raw as Row;
        const type = ((p.type as string | null) ?? "casa").toLowerCase();
        const price = typeof p.price_mxn === "number" ? p.price_mxn : null;
        return {
          id: String(p.id ?? ""),
          slug: String((p.slug as string | null) ?? p.id ?? ""),
          title: (p.title_es as string | null) ?? "Propiedad sin titulo",
          city: (p.city as string | null) ?? "Sin ciudad",
          type,
          status: ((p.status as string | null) ?? "draft").toLowerCase(),
          priceLabel: price ? `$${price.toLocaleString("es-MX")}` : "Precio por definir",
          emoji: typeEmoji[type] ?? "🏠",
        };
      });

      setProperties(mapped);
    }

    void load();
    return () => {
      mounted = false;
    };
  }, [supabase]);

  // Semantic search with debounce
  async function runSemanticSearch(q: string) {
    if (!q.trim()) { setAiResults([]); setAiSource(null); return; }
    setAiLoading(true);
    try {
      const res = await fetch("/api/properties/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, limit: 6 }),
      });
      const data = await res.json() as { matches: SemanticResult[]; source: "pgvector" | "fallback" };
      setAiResults(data.matches ?? []);
      setAiSource(data.source);
    } finally {
      setAiLoading(false);
    }
  }

  function handleQueryChange(val: string) {
    setQuery(val);
    if (!aiMode) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => void runSemanticSearch(val), 600);
  }

  function toggleAiMode() {
    setAiMode(m => {
      if (!m && query.trim()) void runSemanticSearch(query);
      if (m) { setAiResults([]); setAiSource(null); }
      return !m;
    });
  }

  const filtered = useMemo(() => {
    return properties.filter((property) => {
      const byType = activeType === "all" ? true : property.type === activeType;
      const text = query.toLowerCase();
      const byText = property.title.toLowerCase().includes(text) || property.city.toLowerCase().includes(text);
      return byType && byText;
    });
  }, [activeType, properties, query]);

  return (
    <PageWrapper
      title="Propiedades"
      actions={
        <Link href="/propiedades/nueva" className="btn btn-primary">
          <span>+ Nueva</span>
        </Link>
      }
    >
      <section className="rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary">
        <div className="border-b-[0.5px] border-border-tertiary p-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 max-w-[320px]">
              <input
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                className="input-base w-full pr-8"
                placeholder={aiMode ? "✦ Buscar con IA: 'casa con alberca en Huatulco'..." : "🔍 Buscar..."}
              />
              {aiLoading && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-brand">...</span>
              )}
            </div>
            <button
              type="button"
              onClick={toggleAiMode}
              className={`rounded-[8px] border-[0.5px] px-3 py-1.5 text-[10px] font-medium transition ${
                aiMode
                  ? "border-brand bg-brand-light text-brand-dark"
                  : "border-border-tertiary bg-bg-secondary text-text-tertiary hover:text-text-primary"
              }`}
            >
              ✦ IA
            </button>
            {!aiMode && (
              <>
                <Chip active={activeType === "casa"}    onClick={() => setActiveType("casa")}>Casa</Chip>
                <Chip active={activeType === "depto"}   onClick={() => setActiveType("depto")}>Depto</Chip>
                <Chip active={activeType === "terreno"} onClick={() => setActiveType("terreno")}>Terreno</Chip>
                <Chip active={activeType === "all"}     onClick={() => setActiveType("all")}>Todos</Chip>
              </>
            )}
          </div>
          {aiMode && aiSource && (
            <p className="mt-1.5 text-[9px] text-text-tertiary">
              {aiSource === "pgvector" ? "✦ Resultados por similitud semántica (pgvector)" : "✦ Resultados aproximados (embeddings en proceso)"}
            </p>
          )}
        </div>

        {/* AI semantic results */}
        {aiMode ? (
          <div className="grid gap-3 p-3 md:grid-cols-2 xl:grid-cols-3">
            {aiResults.length === 0 && !aiLoading ? (
              <div className="col-span-full py-8 text-center">
                <p className="text-[24px]">✦</p>
                <p className="mt-1 text-[11px] text-text-tertiary">
                  {query.trim() ? "Sin coincidencias. Prueba otra descripción." : "Escribe qué tipo de propiedad buscas en lenguaje natural."}
                </p>
              </div>
            ) : (
              aiResults.map((p) => (
                <div key={p.id} className="overflow-hidden rounded-[12px] border-[0.5px] border-brand-border bg-bg-primary">
                  <Link href={`/p/${p.slug}`}>
                    {p.photo ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={p.photo} alt="" className="h-28 w-full object-cover" />
                    ) : (
                      <div className="flex h-28 items-center justify-center bg-gradient-to-br from-[#8B7355] to-[#C4A882] text-[34px]">
                        {typeEmoji[p.type] ?? "🏠"}
                      </div>
                    )}
                    <div className="space-y-1 p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-[12px] font-medium text-text-primary">{p.title}</p>
                        <span className="text-[9px] text-brand">{Math.round(p.similarity * 100)}% match</span>
                      </div>
                      <p className="text-[16px] font-medium text-brand-dark">
                        {p.price_mxn ? `$${Number(p.price_mxn).toLocaleString("es-MX")}` : "Precio a convenir"}
                      </p>
                      <p className="text-[10px] text-text-tertiary">{p.city}</p>
                      <p className="text-[9px] text-text-tertiary line-clamp-1">{p.features}</p>
                    </div>
                  </Link>
                  <div className="flex items-center gap-2 border-t-[0.5px] border-border-tertiary px-3 py-2">
                    <Link href={`/propiedades/${p.id}/editar`} className="btn btn-ghost btn-sm flex-1 justify-center">Editar</Link>
                    <Link href={`/p/${p.slug}`} target="_blank" className="btn btn-ghost btn-sm flex-1 justify-center">Ver pública</Link>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="grid gap-3 p-3 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((property) => (
              <div key={property.id} className="overflow-hidden rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary">
                <Link href={`/p/${property.slug}`}>
                  <div className="relative flex h-28 items-center justify-center bg-gradient-to-br from-[#8B7355] to-[#C4A882] text-[34px]">
                    {property.emoji}
                    <span className={`absolute right-2 top-2 rounded-full px-2 py-[2px] text-[8px] font-semibold ${statusClasses[property.status] ?? "bg-bg-secondary text-text-tertiary"}`}>
                      {property.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="space-y-1 p-3">
                    <p className="text-[12px] font-medium text-text-primary">{property.title}</p>
                    <p className="text-[16px] font-medium text-brand-dark">{property.priceLabel}</p>
                    <p className="text-[10px] text-text-tertiary">{property.city}</p>
                  </div>
                </Link>
                <div className="flex items-center gap-2 border-t-[0.5px] border-border-tertiary px-3 py-2">
                  <Link href={`/propiedades/${property.id}/editar`} className="btn btn-ghost btn-sm flex-1 justify-center">Editar</Link>
                  <Link href={`/p/${property.slug}`} target="_blank" className="btn btn-ghost btn-sm flex-1 justify-center">Ver pública</Link>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="rounded-[12px] border-[0.5px] border-border-tertiary p-4 text-[11px] text-text-tertiary">
                No hay propiedades para este filtro.
              </div>
            )}
          </div>
        )}
      </section>
    </PageWrapper>
  );
}
