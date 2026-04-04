"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { scoreToTemperature, LEAD_TEMP_META, LEAD_STATUS_LABEL, type LeadStatus } from "@/types/lead";

type ReportTab = "leads" | "propiedades" | "chatbot" | "roi";

const TABS: { id: ReportTab; label: string }[] = [
  { id: "leads",       label: "Leads"        },
  { id: "propiedades", label: "Propiedades"  },
  { id: "chatbot",     label: "Chatbot"      },
  { id: "roi",         label: "ROI"          },
];

type Row = Record<string, unknown>;

/* ── helpers ─────────────────────────────────────── */

function pct(value: number, total: number) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

function fmxn(n: number) {
  return `$${n.toLocaleString("es-MX")}`;
}

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className="rounded-[10px] border-[0.5px] border-border-tertiary bg-bg-primary p-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.05em] text-text-tertiary">{label}</p>
      <p className={`mt-1 text-[22px] font-semibold leading-none ${accent ? "text-brand-dark" : "text-text-primary"}`}>
        {value}
      </p>
      {sub ? <p className="mt-1 text-[10px] text-text-tertiary">{sub}</p> : null}
    </div>
  );
}

function BarRow({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const p = pct(value, total);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px]">
        <span className="text-text-secondary">{label}</span>
        <span className="font-medium text-text-primary">{value} <span className="text-text-tertiary">({p}%)</span></span>
      </div>
      <div className="h-[5px] w-full rounded-full bg-bg-tertiary">
        <div className="h-full rounded-full transition-all" style={{ width: `${p}%`, background: color }} />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════ */

export default function ReportesPage() {
  const supabase = createClient();
  const [tab, setTab] = useState<ReportTab>("leads");
  const [loading, setLoading] = useState(true);

  // Data
  const [leads, setLeads] = useState<Row[]>([]);
  const [props, setProps] = useState<Row[]>([]);
  const [convs, setConvs] = useState<Row[]>([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const [{ data: leadsData }, { data: propsData }, { data: convsData }] = await Promise.all([
        supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(200),
        supabase.from("properties").select("id, type, city, status, price_mxn, created_at").limit(200),
        supabase.from("conversations").select("id, role, language, created_at, lead_id").limit(500),
      ]);
      if (!mounted) return;
      setLeads(leadsData ?? []);
      setProps(propsData ?? []);
      setConvs(convsData ?? []);
      setLoading(false);
    }
    void load();
    return () => { mounted = false; };
  }, [supabase]);

  /* ── Leads stats ─── */
  const totalLeads = leads.length;
  const hotLeads  = leads.filter(l => scoreToTemperature(Number(l.ai_score ?? 0)) === "hot").length;
  const warmLeads = leads.filter(l => scoreToTemperature(Number(l.ai_score ?? 0)) === "warm").length;
  const coldLeads = leads.filter(l => scoreToTemperature(Number(l.ai_score ?? 0)) === "cold").length;
  const avgScore  = totalLeads ? Math.round(leads.reduce((s, l) => s + Number(l.ai_score ?? 0), 0) / totalLeads) : 0;

  const leadsByStatus = Object.entries(
    leads.reduce<Record<string, number>>((acc, l) => {
      const s = String(l.status ?? "new");
      acc[s] = (acc[s] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  const leadsBySource = Object.entries(
    leads.reduce<Record<string, number>>((acc, l) => {
      const s = String(l.source ?? "direct");
      acc[s] = (acc[s] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  const SOURCE_LABEL: Record<string, string> = {
    whatsapp: "WhatsApp", portal: "Portal", referral: "Referido", direct: "Directo",
  };

  /* ── Props stats ─── */
  const totalProps  = props.length;
  const activeProps = props.filter(p => p.status === "active").length;
  const priceList   = props.filter(p => p.price_mxn).map(p => Number(p.price_mxn));
  const avgPrice    = priceList.length ? Math.round(priceList.reduce((s, v) => s + v, 0) / priceList.length) : 0;

  const propsByType = Object.entries(
    props.reduce<Record<string, number>>((acc, p) => {
      const t = String(p.type ?? "otro");
      acc[t] = (acc[t] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const propsByCity = Object.entries(
    props.reduce<Record<string, number>>((acc, p) => {
      const c = String(p.city ?? "Sin ciudad");
      acc[c] = (acc[c] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 5);

  /* ── Chatbot stats ─── */
  const totalMsgs   = convs.length;
  const botMsgs     = convs.filter(c => c.role === "bot").length;
  const clientMsgs  = convs.filter(c => c.role === "client").length;
  const autoRate    = pct(botMsgs, totalMsgs);
  const enMsgs      = convs.filter(c => c.language === "en").length;
  const uniqueLeads = new Set(convs.map(c => c.lead_id)).size;

  /* ── ROI stats ─── */
  const closedLeads   = leads.filter(l => l.status === "closed").length;
  const convRate      = pct(closedLeads, totalLeads);
  const estimatedRevenue = closedLeads * avgPrice * 0.03; // 3% comisión estimada

  if (loading) {
    return (
      <PageWrapper title="Reportes">
        <div className="rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary p-8 text-center text-[11px] text-text-tertiary">
          Cargando datos...
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Reportes">
      <section className="rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary">

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 border-b-[0.5px] border-border-tertiary px-3 pt-1">
          {TABS.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-t-[8px] px-4 py-2 text-[11px] transition ${
                tab === t.id
                  ? "border-b-2 border-brand font-medium text-brand-dark"
                  : "text-text-tertiary hover:text-text-secondary"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-4">

          {/* ── LEADS ── */}
          {tab === "leads" && (
            <div className="space-y-4">
              {/* KPIs */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard label="Total leads" value={String(totalLeads)} />
                <StatCard label="Score promedio" value={String(avgScore)} sub="sobre 100" accent />
                <StatCard label="Calientes 🔥" value={String(hotLeads)} sub={`${pct(hotLeads, totalLeads)}% del total`} />
                <StatCard label="Tibios 🟡" value={String(warmLeads)} sub={`${pct(warmLeads, totalLeads)}% del total`} />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Temperatura */}
                <div className="rounded-[10px] border-[0.5px] border-border-tertiary p-3">
                  <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.05em] text-text-tertiary">
                    Temperatura
                  </h3>
                  <div className="space-y-3">
                    <BarRow label="🔥 Calientes" value={hotLeads}  total={totalLeads} color="#A32D2D" />
                    <BarRow label="🟡 Tibios"    value={warmLeads} total={totalLeads} color="#854F0B" />
                    <BarRow label="🧊 Fríos"     value={coldLeads} total={totalLeads} color="#9090a8" />
                  </div>
                </div>

                {/* Fuente */}
                <div className="rounded-[10px] border-[0.5px] border-border-tertiary p-3">
                  <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.05em] text-text-tertiary">
                    Fuente
                  </h3>
                  <div className="space-y-3">
                    {leadsBySource.map(([src, count]) => (
                      <BarRow
                        key={src}
                        label={SOURCE_LABEL[src] ?? src}
                        value={count}
                        total={totalLeads}
                        color="var(--color-brand)"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Estado */}
              <div className="rounded-[10px] border-[0.5px] border-border-tertiary p-3">
                <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.05em] text-text-tertiary">
                  Por estado
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {leadsByStatus.map(([status, count]) => (
                    <BarRow
                      key={status}
                      label={LEAD_STATUS_LABEL[status as LeadStatus] ?? status}
                      value={count}
                      total={totalLeads}
                      color="var(--color-success)"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── PROPIEDADES ── */}
          {tab === "propiedades" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <StatCard label="Total propiedades" value={String(totalProps)} />
                <StatCard label="Activas" value={String(activeProps)} sub={`${pct(activeProps, totalProps)}% del total`} accent />
                <StatCard label="Precio promedio" value={avgPrice ? fmxn(avgPrice) : "—"} sub="MXN" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[10px] border-[0.5px] border-border-tertiary p-3">
                  <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.05em] text-text-tertiary">
                    Por tipo
                  </h3>
                  <div className="space-y-3">
                    {propsByType.length ? propsByType.map(([type, count]) => (
                      <BarRow key={type} label={type} value={count} total={totalProps} color="var(--color-brand)" />
                    )) : <p className="text-[11px] text-text-tertiary">Sin datos</p>}
                  </div>
                </div>

                <div className="rounded-[10px] border-[0.5px] border-border-tertiary p-3">
                  <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.05em] text-text-tertiary">
                    Por ciudad
                  </h3>
                  <div className="space-y-3">
                    {propsByCity.length ? propsByCity.map(([city, count]) => (
                      <BarRow key={city} label={city} value={count} total={totalProps} color="var(--color-success)" />
                    )) : <p className="text-[11px] text-text-tertiary">Sin datos</p>}
                  </div>
                </div>
              </div>

              {/* Precios */}
              {priceList.length > 0 && (
                <div className="rounded-[10px] border-[0.5px] border-border-tertiary p-3">
                  <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.05em] text-text-tertiary">
                    Rango de precios
                  </h3>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-[9px] text-text-tertiary">Mínimo</p>
                      <p className="text-[13px] font-semibold text-text-primary">{fmxn(Math.min(...priceList))}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-text-tertiary">Promedio</p>
                      <p className="text-[13px] font-semibold text-brand-dark">{fmxn(avgPrice)}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-text-tertiary">Máximo</p>
                      <p className="text-[13px] font-semibold text-text-primary">{fmxn(Math.max(...priceList))}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── CHATBOT ── */}
          {tab === "chatbot" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard label="Mensajes totales" value={String(totalMsgs)} />
                <StatCard label="Leads activos" value={String(uniqueLeads)} sub="con conversación" accent />
                <StatCard label="Automatización" value={`${autoRate}%`} sub="respondido por bot" />
                <StatCard label="En inglés" value={`${pct(enMsgs, clientMsgs)}%`} sub="de clientes" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[10px] border-[0.5px] border-border-tertiary p-3">
                  <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.05em] text-text-tertiary">
                    Distribución de mensajes
                  </h3>
                  <div className="space-y-3">
                    <BarRow label="✦ Bot (Sofía)"  value={botMsgs}   total={totalMsgs} color="var(--color-brand)" />
                    <BarRow label="Cliente"         value={clientMsgs} total={totalMsgs} color="var(--color-success)" />
                    <BarRow label="Agente humano"   value={totalMsgs - botMsgs - clientMsgs} total={totalMsgs} color="#9090a8" />
                  </div>
                </div>

                <div className="rounded-[10px] border-[0.5px] border-border-tertiary p-3">
                  <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.05em] text-text-tertiary">
                    Idioma de clientes
                  </h3>
                  <div className="space-y-3">
                    <BarRow label="🇲🇽 Español" value={clientMsgs - enMsgs} total={clientMsgs} color="var(--color-brand)" />
                    <BarRow label="🇺🇸 Inglés"  value={enMsgs}              total={clientMsgs} color="var(--color-success)" />
                  </div>
                </div>
              </div>

              {totalMsgs === 0 && (
                <div className="rounded-[10px] border-[0.5px] border-brand-border bg-brand-light p-4 text-center">
                  <p className="text-[11px] text-brand-dark">
                    ✦ Aún no hay conversaciones registradas. Configura el webhook de Twilio para empezar a recibir mensajes.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── ROI ── */}
          {tab === "roi" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard label="Leads totales" value={String(totalLeads)} />
                <StatCard label="Cerrados" value={String(closedLeads)} sub={`${convRate}% conversión`} accent />
                <StatCard label="Precio prom." value={avgPrice ? fmxn(avgPrice) : "—"} sub="por propiedad" />
                <StatCard label="Revenue est." value={estimatedRevenue ? fmxn(Math.round(estimatedRevenue)) : "—"} sub="3% comisión" accent />
              </div>

              {/* Embudo */}
              <div className="rounded-[10px] border-[0.5px] border-border-tertiary p-3">
                <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.05em] text-text-tertiary">
                  Embudo de conversión
                </h3>
                <div className="space-y-2">
                  {[
                    { label: "Leads captados",    value: totalLeads,                          color: "#9090a8" },
                    { label: "Leads calificados", value: hotLeads + warmLeads,                color: "#854F0B" },
                    { label: "Visitas agendadas", value: leads.filter(l => l.status === "visit_scheduled" || l.status === "visit_done").length, color: "var(--color-brand)" },
                    { label: "Cerrados",          value: closedLeads,                         color: "var(--color-success)" },
                  ].map(row => (
                    <BarRow key={row.label} label={row.label} value={row.value} total={totalLeads || 1} color={row.color} />
                  ))}
                </div>
              </div>

              {/* Proyección */}
              <div className="rounded-[10px] border-[0.5px] border-brand-border bg-brand-light p-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.05em] text-brand">✦ Proyección mensual</p>
                <div className="mt-2 grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-[9px] text-text-tertiary">Si cierras 5%</p>
                    <p className="text-[13px] font-semibold text-brand-dark">{fmxn(Math.round(totalLeads * 0.05 * avgPrice * 0.03))}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-text-tertiary">Si cierras 10%</p>
                    <p className="text-[13px] font-semibold text-brand-dark">{fmxn(Math.round(totalLeads * 0.10 * avgPrice * 0.03))}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-text-tertiary">Si cierras 20%</p>
                    <p className="text-[13px] font-semibold text-brand-dark">{fmxn(Math.round(totalLeads * 0.20 * avgPrice * 0.03))}</p>
                  </div>
                </div>
                <p className="mt-2 text-[9px] text-text-tertiary">Basado en {totalLeads} leads y precio promedio de {avgPrice ? fmxn(avgPrice) : "sin datos"}.</p>
              </div>
            </div>
          )}

        </div>
      </section>
    </PageWrapper>
  );
}
