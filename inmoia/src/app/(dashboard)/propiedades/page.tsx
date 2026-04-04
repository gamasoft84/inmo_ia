"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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

export default function PropiedadesPage() {
  const supabase = createClient();
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<TypeFilter>("all");
  const [properties, setProperties] = useState<PropertyItem[]>([]);

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
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input-base max-w-[320px]"
              placeholder="🔍 Buscar..."
            />
            <Chip active={activeType === "casa"} onClick={() => setActiveType("casa")}>Casa</Chip>
            <Chip active={activeType === "depto"} onClick={() => setActiveType("depto")}>Depto</Chip>
            <Chip active={activeType === "terreno"} onClick={() => setActiveType("terreno")}>Terreno</Chip>
            <Chip active={activeType === "all"} onClick={() => setActiveType("all")}>Todos</Chip>
          </div>
        </div>

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
                <Link href={`/propiedades/${property.id}/editar`} className="btn btn-ghost btn-sm flex-1 justify-center">
                  Editar
                </Link>
                <Link href={`/p/${property.slug}`} target="_blank" className="btn btn-ghost btn-sm flex-1 justify-center">
                  Ver pública
                </Link>
              </div>
            </div>
          ))}
            {filtered.length === 0 ? (
              <div className="rounded-[12px] border-[0.5px] border-border-tertiary p-4 text-[11px] text-text-tertiary">
                No hay propiedades para este filtro.
              </div>
            ) : null}
        </div>
      </section>
    </PageWrapper>
  );
}
