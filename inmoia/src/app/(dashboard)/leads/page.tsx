"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Chip } from "@/components/ui/Chip";

type Temp = "hot" | "warm" | "cold";

type LeadListItem = {
  id: string;
  initials: string;
  name: string;
  property: string;
  time: string;
  temp: Temp;
  score: number;
};

type Row = Record<string, unknown>;

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
  const supabase = createClient();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Temp | "all">("all");
  const [leadData, setLeadData] = useState<LeadListItem[]>([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const { data } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(80);

      if (!mounted) return;

      const mapped: LeadListItem[] = (data ?? []).map((raw) => {
        const lead = raw as Row;
        const name = (lead.name as string | null) ?? "Lead sin nombre";
        const pieces = name.split(" ").filter(Boolean);
        const initials = pieces.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("") || "--";
        const created = lead.created_at ? new Date(String(lead.created_at)).toLocaleDateString("es-MX") : "reciente";
        const tempRaw = ((lead.temperature as string | null) ?? "cold").toLowerCase();
        const temp = ["hot", "warm", "cold"].includes(tempRaw) ? (tempRaw as Temp) : "cold";
        return {
          id: String(lead.id ?? ""),
          initials,
          name,
          property: (lead.preferred_type as string | null) ?? "Sin preferencia",
          time: created,
          temp,
          score: Number((lead.ai_score as number | null) ?? 0),
        };
      });

      setLeadData(mapped);
    }

    void load();
    return () => {
      mounted = false;
    };
  }, [supabase]);

  const filtered = useMemo(() => {
    return leadData.filter((lead) => {
      const byTemp = active === "all" ? true : lead.temp === active;
      const q = query.toLowerCase();
      const byText =
        lead.name.toLowerCase().includes(q) ||
        lead.property.toLowerCase().includes(q);
      return byTemp && byText;
    });
  }, [active, leadData, query]);

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
