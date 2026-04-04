"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";

type Temp = "hot" | "warm" | "cold";

type LeadItem = {
  id: string;
  initials: string;
  name: string;
  meta: string;
  temp: Temp;
};

type Row = Record<string, unknown>;

const tempStyles: Record<Temp, string> = {
  hot: "bg-error-light text-error",
  warm: "bg-brand-light text-brand-dark",
  cold: "bg-bg-secondary text-text-tertiary",
};

const tempLabel: Record<Temp, string> = {
  hot: "caliente",
  warm: "tibio",
  cold: "frio",
};

function initialsFromName(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "--";
}

function fromNowLabel(value?: string | null) {
  if (!value) return "reciente";
  const now = Date.now();
  const when = new Date(value).getTime();
  const diffMin = Math.max(0, Math.floor((now - when) / 60000));
  if (diffMin < 60) return `hace ${diffMin || 1} min`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `hace ${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  return diffDays === 1 ? "ayer" : `hace ${diffDays} dias`;
}

export default function DashboardPage() {
  const supabase = createClient();
  const [stats, setStats] = useState([
    { label: "LEADS HOY", value: "0" },
    { label: "BOT AUTO", value: "0%" },
    { label: "VISITAS", value: "0" },
    { label: "PROPS", value: "0" },
  ]);
  const [leads, setLeads] = useState<LeadItem[]>([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const todayIso = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();

      const [leadsTodayRes, visitsRes, propertiesRes, convTotalRes, convBotRes, recentRes] = await Promise.all([
        supabase.from("leads").select("*", { count: "exact", head: true }).gte("created_at", todayIso),
        supabase.from("visits").select("*", { count: "exact", head: true }),
        supabase.from("properties").select("*", { count: "exact", head: true }),
        supabase.from("conversations").select("*", { count: "exact", head: true }),
        supabase.from("conversations").select("*", { count: "exact", head: true }).eq("role", "bot"),
        supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(5),
      ]);

      const totalConversations = convTotalRes.count ?? 0;
      const botConversations = convBotRes.count ?? 0;
      const botAuto = totalConversations > 0 ? Math.round((botConversations / totalConversations) * 100) : 0;

      const leadItems: LeadItem[] = (recentRes.data ?? []).map((raw) => {
        const lead = raw as Row;
        const name = (lead.name as string | null) ?? "Lead sin nombre";
        const temp = ((lead.temperature as string | null) ?? "cold").toLowerCase() as Temp;
        const tempSafe: Temp = ["hot", "warm", "cold"].includes(temp) ? temp : "cold";
        return {
          id: String(lead.id ?? ""),
          initials: initialsFromName(name),
          name,
          meta: `${String(lead.city ?? "Sin ciudad")} · ${fromNowLabel((lead.created_at as string | null) ?? null)}`,
          temp: tempSafe,
        };
      });

      if (!mounted) return;

      setStats([
        { label: "LEADS HOY", value: String(leadsTodayRes.count ?? 0) },
        { label: "BOT AUTO", value: `${botAuto}%` },
        { label: "VISITAS", value: String(visitsRes.count ?? 0) },
        { label: "PROPS", value: String(propertiesRes.count ?? 0) },
      ]);
      setLeads(leadItems);
    }

    void load();
    return () => {
      mounted = false;
    };
  }, [supabase]);

  const hottestLead = useMemo(() => leads.find((lead) => lead.temp === "hot"), [leads]);

  return (
    <PageWrapper
      title="Dashboard"
      actions={
        <>
          <Button variant="brand-soft" ai>
            Generar resumen
          </Button>
          <Link href="/propiedades/nueva" className="btn btn-primary">
            <span>Nueva propiedad</span>
          </Link>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary p-4">
            <p className="text-[9px] font-medium tracking-[0.05em] text-text-tertiary">{item.label}</p>
            <p className="mt-1 text-[28px] font-medium leading-none tracking-[-0.02em] text-brand">{item.value}</p>
          </div>
        ))}
      </div>

      {hottestLead ? (
        <div className="mt-3 rounded-[12px] border-[0.5px] border-brand-border bg-brand-light px-3 py-2 text-[11px] text-brand-text">
          🔥 {hottestLead.name} es lead caliente
        </div>
      ) : null}

      <div className="mt-3 grid gap-3 xl:grid-cols-[1.35fr_1fr]">
        <section className="rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary">
          <header className="flex items-center justify-between border-b-[0.5px] border-border-tertiary px-4 py-3">
            <h2 className="text-[12px] font-medium">Leads recientes</h2>
            <Link href="/leads" className="text-[10px] text-brand">
              Ver todos →
            </Link>
          </header>

          <div>
            {leads.map((lead) => (
              <Link
                href={`/leads/${lead.id}`}
                key={lead.id}
                className="flex items-center gap-2 border-b-[0.5px] border-border-tertiary px-4 py-3 last:border-b-0"
              >
                <div className="avatar avatar-sm">{lead.initials}</div>
                <div className="flex-1">
                  <p className="text-[12px] font-medium text-text-primary">{lead.name}</p>
                  <p className="text-[10px] text-text-tertiary">{lead.meta}</p>
                </div>
                <span className={`pill ${tempStyles[lead.temp as keyof typeof tempStyles]}`}>
                  {tempLabel[lead.temp]}
                </span>
              </Link>
            ))}
            {leads.length === 0 ? (
              <div className="px-4 py-5 text-[11px] text-text-tertiary">No hay leads recientes.</div>
            ) : null}
          </div>
        </section>

        <section className="rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary p-4">
          <h2 className="text-[12px] font-medium">Actividad del chatbot</h2>
          <p className="mt-1 text-[11px] text-text-tertiary">Sofia esta respondiendo el 83% de conversaciones sin ayuda.</p>

          <div className="mt-4 space-y-3">
            <div>
              <div className="mb-1 flex items-center justify-between text-[10px] text-text-secondary">
                <span>Autonomia del bot</span>
                <span>83%</span>
              </div>
              <ProgressBar value={83} />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between text-[10px] text-text-secondary">
                <span>Tiempo medio de respuesta</span>
                <span>1.8s</span>
              </div>
              <ProgressBar value={92} />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between text-[10px] text-text-secondary">
                <span>Leads calificados hoy</span>
                <span>14/23</span>
              </div>
              <ProgressBar value={61} />
            </div>
          </div>

          <Link href="/chatbot" className="mt-4 inline-block text-[10px] text-brand">
            Ir al panel del chatbot →
          </Link>
        </section>
      </div>
    </PageWrapper>
  );
}
