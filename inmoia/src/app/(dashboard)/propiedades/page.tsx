"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Chip } from "@/components/ui/Chip";

type TypeFilter = "all" | "casa" | "depto" | "terreno";

const properties = [
  { id: "casa-coyoacan-210m2-a3f9", emoji: "🏡", title: "Casa Coyoacan", price: "$5,800,000", info: "🔥 15 leads · 18 dias", status: "activa", type: "casa" as const },
  { id: "terreno-huatulco-950m2-h92b", emoji: "🌊", title: "Terreno Huatulco", price: "$2,800,000", info: "🔥 8 leads · $140k USD", status: "nueva", type: "terreno" as const },
  { id: "depto-santa-fe-120m2-b718", emoji: "🏢", title: "Depto Santa Fe", price: "$4,450,000", info: "🟡 6 leads · 7 dias", status: "pausada", type: "depto" as const },
  { id: "casa-pedregal-260m2-f11c", emoji: "🏠", title: "Casa Pedregal", price: "$6,200,000", info: "✅ vendida", status: "vendida", type: "casa" as const },
];

const statusClasses: Record<string, string> = {
  activa: "bg-success-light text-success",
  nueva: "bg-brand-light text-brand-dark",
  pausada: "bg-brand-light text-brand-dark",
  vendida: "bg-info-light text-info",
};

export default function PropiedadesPage() {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<TypeFilter>("casa");

  const filtered = useMemo(() => {
    return properties.filter((property) => {
      const byType = activeType === "all" ? true : property.type === activeType;
      const byText = property.title.toLowerCase().includes(query.toLowerCase());
      return byType && byText;
    });
  }, [activeType, query]);

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
            <Link
              key={property.id}
              href={`/p/${property.id}`}
              className="overflow-hidden rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary"
            >
              <div className="relative flex h-28 items-center justify-center bg-gradient-to-br from-[#8B7355] to-[#C4A882] text-[34px]">
                {property.emoji}
                <span className={`absolute right-2 top-2 rounded-full px-2 py-[2px] text-[8px] font-semibold ${statusClasses[property.status]}`}>
                  {property.status.toUpperCase()}
                </span>
              </div>
              <div className="space-y-1 p-3">
                <p className="text-[12px] font-medium text-text-primary">{property.title}</p>
                <p className="text-[16px] font-medium text-brand-dark">{property.price}</p>
                <p className="text-[10px] text-text-tertiary">{property.info}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageWrapper>
  );
}
