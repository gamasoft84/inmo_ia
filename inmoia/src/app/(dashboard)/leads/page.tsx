"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Chip } from "@/components/ui/Chip";

type Temp = "hot" | "warm" | "cold";

const leadData = [
  { id: "carlos-mendoza", initials: "CM", name: "Carlos Mendoza", property: "Casa Coyoacan", time: "hace 5 min", temp: "hot" as Temp, score: 87 },
  { id: "ana-torres", initials: "AT", name: "Ana Torres", property: "Depto Santa Fe", time: "hace 2h", temp: "warm" as Temp, score: 63 },
  { id: "roberto-silva", initials: "RS", name: "Roberto Silva", property: "Terreno Huatulco", time: "ayer", temp: "cold" as Temp, score: 28 },
  { id: "maria-lopez", initials: "ML", name: "Maria Lopez", property: "Casa Pedregal", time: "hace 45 min", temp: "hot" as Temp, score: 81 },
  { id: "jorge-ruiz", initials: "JR", name: "Jorge Ruiz", property: "Depto Roma", time: "hace 3h", temp: "warm" as Temp, score: 51 },
];

const tempLabel: Record<Temp, string> = {
  hot: "caliente",
  warm: "tibio",
  cold: "frio",
};

const tempClass: Record<Temp, string> = {
  hot: "pill pill-hot",
  warm: "pill pill-warm",
  cold: "pill pill-cold",
};

export default function LeadsPage() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Temp | "all">("hot");

  const filtered = useMemo(() => {
    return leadData.filter((lead) => {
      const byTemp = active === "all" ? true : lead.temp === active;
      const q = query.toLowerCase();
      const byText =
        lead.name.toLowerCase().includes(q) ||
        lead.property.toLowerCase().includes(q);
      return byTemp && byText;
    });
  }, [active, query]);

  return (
    <PageWrapper title="Leads">
      <div className="rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary">
        <div className="border-b-[0.5px] border-border-tertiary p-3">
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="🔍 Buscar leads..."
              className="input-base max-w-[320px]"
            />
            <Chip active={active === "hot"} onClick={() => setActive("hot")}>🔥 Calientes</Chip>
            <Chip active={active === "warm"} onClick={() => setActive("warm")}>🟡 Tibios</Chip>
            <Chip active={active === "cold"} onClick={() => setActive("cold")}>🧊 Frios</Chip>
            <Chip active={active === "all"} onClick={() => setActive("all")}>Todos</Chip>
          </div>
        </div>

        <div>
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-[11px] text-text-tertiary">
              No hay leads para este filtro.
            </div>
          ) : (
            filtered.map((lead) => (
              <Link
                key={lead.id}
                href={`/leads/${lead.id}`}
                className="flex items-center gap-3 border-b-[0.5px] border-border-tertiary px-3 py-3 last:border-b-0"
              >
                <div className="avatar avatar-sm">{lead.initials}</div>
                <div className="flex-1">
                  <p className="text-[12px] font-medium text-text-primary">{lead.name}</p>
                  <p className="text-[10px] text-text-tertiary">
                    {lead.property} · {lead.time}
                  </p>
                </div>
                <p className="mr-1 text-[10px] text-text-tertiary">Score {lead.score}</p>
                <span className={tempClass[lead.temp]}>{tempLabel[lead.temp]}</span>
              </Link>
            ))
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
