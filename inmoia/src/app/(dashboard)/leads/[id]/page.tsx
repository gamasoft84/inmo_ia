"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/Button";
import {
  LEAD_TEMP_META,
  LEAD_STATUS_LABEL,
  scoreToTemperature,
  type LeadStatus,
} from "@/types/lead";

type LeadTab = "resumen" | "conversacion" | "props" | "tareas" | "notas";
type Row = Record<string, unknown>;

const TABS: { id: LeadTab; label: string }[] = [
  { id: "resumen",      label: "Resumen"      },
  { id: "conversacion", label: "Conversación" },
  { id: "props",        label: "Props vistas" },
  { id: "tareas",       label: "Tareas"       },
  { id: "notas",        label: "Notas"        },
];

const SOURCE_LABEL: Record<string, string> = {
  whatsapp: "WhatsApp",
  portal:   "Portal",
  referral: "Referido",
  direct:   "Directo",
};

const URGENCY_LABEL: Record<string, string> = {
  this_month: "Este mes",
  "3_months": "En 3 meses",
  no_rush:    "Sin prisa",
};

const CREDIT_LABEL: Record<string, string> = {
  cash:    "Contado",
  bank:    "Crédito bancario",
  infonavit: "Infonavit",
  cofinavit: "Cofinavit",
  none:    "Sin crédito",
};

function relativeTime(iso: string | null | undefined): string {
  if (!iso) return "Nunca";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Hace un momento";
  if (mins < 60) return `Hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Ayer";
  if (days < 30) return `Hace ${days} días`;
  return new Date(iso).toLocaleDateString("es-MX", { day: "numeric", month: "short" });
}

interface Task {
  id: string;
  text: string;
  done: boolean;
}

export default function LeadDetailPage() {
  const supabase = createClient();
  const params = useParams<{ id: string }>();
  const leadId = params?.id;

  const [activeTab, setActiveTab] = useState<LeadTab>("resumen");
  const [lead, setLead] = useState<Row | null>(null);
  const [conversation, setConversation] = useState<Row[]>([]);
  const [matchedProps, setMatchedProps] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  // Tareas — local state (PATCH notes on change)
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  // Notas
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!leadId) return;

      const [{ data: leadData }, { data: convData }] = await Promise.all([
        supabase.from("leads").select("*").eq("id", leadId).maybeSingle(),
        supabase
          .from("conversations")
          .select("*")
          .eq("lead_id", leadId)
          .order("created_at", { ascending: true })
          .limit(60),
      ]);

      if (!mounted) return;
      setLead(leadData ?? null);
      setConversation(convData ?? []);
      setNotes(String(leadData?.notes ?? ""));

      // Parse tasks from notes metadata or just start empty
      // (tasks are stored as JSON in a separate field if available)
      if (leadData && Array.isArray(leadData.tasks)) {
        setTasks(leadData.tasks as Task[]);
      }

      // Load matching properties
      if (leadData?.city || leadData?.preferred_type) {
        let query = supabase
          .from("properties")
          .select("id, slug, title_es, price_mxn, type, city, photos, status")
          .eq("status", "active")
          .limit(4);

        if (leadData.preferred_type) {
          query = query.eq("type", leadData.preferred_type as string);
        } else if (leadData.city) {
          query = query.eq("city", leadData.city as string);
        }

        const { data: props } = await query;
        if (mounted) setMatchedProps(props ?? []);
      }

      setLoading(false);
    }

    void load();
    return () => { mounted = false; };
  }, [leadId, supabase]);

  // Scroll conversation to bottom when tab opens
  useEffect(() => {
    if (activeTab === "conversacion") {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [activeTab, conversation.length]);

  const leadName       = String(lead?.name ?? "Lead");
  const leadPhone      = String(lead?.phone ?? "Sin teléfono");
  const leadCity       = String(lead?.city ?? "");
  const leadScore      = Number(lead?.ai_score ?? 0);
  const temperature    = scoreToTemperature(leadScore);
  const tempMeta       = LEAD_TEMP_META[temperature];
  const leadStatus     = (lead?.status as LeadStatus | undefined) ?? "new";
  const preferredZones = Array.isArray(lead?.preferred_zones)
    ? (lead.preferred_zones as string[]).join(", ")
    : leadCity || "Sin dato";

  // Score indicator style
  const scoreStyle =
    temperature === "hot"
      ? { bg: "#FCEBEB", color: "#A32D2D", border: "#F7C1C1" }
      : temperature === "warm"
      ? { bg: "#FAEEDA", color: "#854F0B", border: "#FAC775" }
      : { bg: "#f0f0f0", color: "#9090a8", border: "#ddd" };

  const initials = leadName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("") || "--";

  // Actions
  async function saveNotes() {
    if (!leadId) return;
    setSavingNotes(true);
    await supabase.from("leads").update({ notes }).eq("id", leadId);
    setSavingNotes(false);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  }

  function addTask() {
    if (!newTask.trim()) return;
    setTasks((prev) => [...prev, { id: crypto.randomUUID(), text: newTask.trim(), done: false }]);
    setNewTask("");
  }

  function toggleTask(id: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  const whatsappHref = leadPhone && leadPhone !== "Sin teléfono"
    ? `https://wa.me/${leadPhone.replace(/\D/g, "")}`
    : "#";

  if (loading) {
    return (
      <PageWrapper title="Lead">
        <div className="rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary p-8 text-center text-[12px] text-text-tertiary">
          Cargando...
        </div>
      </PageWrapper>
    );
  }

  if (!lead) {
    return (
      <PageWrapper title="Lead">
        <div className="rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary p-8 text-center text-[12px] text-text-tertiary">
          Lead no encontrado.
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={leadName}
      actions={
        <>
          <Button variant="brand-soft" ai>✦ Sugerir acción</Button>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            <Button variant="whatsapp">💬 WhatsApp</Button>
          </a>
        </>
      }
    >
      <div className="grid gap-3 xl:grid-cols-[1fr_280px]">
        {/* Main card */}
        <section className="rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary">

          {/* Header */}
          <div className="flex items-center gap-3 border-b-[0.5px] border-border-tertiary bg-bg-secondary px-4 py-3">
            <div className="avatar avatar-md">{initials}</div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[14px] font-medium text-text-primary">{leadName}</p>
                {/* Temperature pill */}
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-[9px] font-semibold"
                  style={{ background: tempMeta.bg, color: tempMeta.color, border: `0.5px solid ${tempMeta.border}` }}
                >
                  {tempMeta.emoji} {tempMeta.label}
                </span>
                {/* Source badge */}
                {lead?.source ? (
                  <span className="rounded-full border-[0.5px] border-border-secondary bg-bg-tertiary px-2 py-[2px] text-[9px] text-text-tertiary">
                    {SOURCE_LABEL[String(lead.source)] ?? String(lead.source)}
                  </span>
                ) : null}
              </div>
              <p className="mt-0.5 text-[10px] text-text-tertiary">
                📱 {leadPhone}
                {leadCity ? ` · ${leadCity}` : ""}
                {" · "}{LEAD_STATUS_LABEL[leadStatus]}
                {" · Último contacto: "}{relativeTime(lead?.last_contact_at as string | null)}
              </p>
            </div>
            {/* Score circle */}
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[1.5px] text-[12px] font-semibold"
              style={{ background: scoreStyle.bg, color: scoreStyle.color, borderColor: scoreStyle.border }}
              title={`Score: ${leadScore} — ${tempMeta.action}`}
            >
              {leadScore}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-1 border-b-[0.5px] border-border-tertiary px-3 pt-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-t-[8px] px-3 py-2 text-[10px] transition ${
                  activeTab === tab.id
                    ? "border-b-2 border-brand font-medium text-brand-dark"
                    : "text-text-tertiary hover:text-text-secondary"
                }`}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-4">

            {/* RESUMEN */}
            {activeTab === "resumen" && (
              <div className="space-y-1">
                <SummaryRow label="Presupuesto máx." value={
                  lead?.budget_max
                    ? `$${Number(lead.budget_max).toLocaleString("es-MX")}`
                    : "Sin dato"
                } brand />
                <SummaryRow label="Zona preferida" value={preferredZones} />
                <SummaryRow
                  label="Urgencia"
                  value={URGENCY_LABEL[String(lead?.urgency ?? "")] ?? (String(lead?.urgency ?? "") || "Sin dato")}
                />
                <SummaryRow
                  label="Tipo de propiedad"
                  value={String(lead?.preferred_type ?? "Sin dato")}
                />
                <SummaryRow
                  label="Tipo de crédito"
                  value={CREDIT_LABEL[String(lead?.credit_type ?? "")] ?? (String(lead?.credit_type ?? "") || "Sin dato")}
                />
                {(lead?.min_bedrooms as number | null) ? (
                  <SummaryRow label="Mín. recámaras" value={String(lead.min_bedrooms)} />
                ) : null}
                <SummaryRow
                  label="Idioma"
                  value={lead?.language === "en" ? "🇺🇸 Inglés" : "🇲🇽 Español"}
                />

                {/* AI Summary */}
                {lead?.ai_summary ? (
                  <div className="mt-3 rounded-[8px] border-[0.5px] border-brand-border bg-brand-light p-3">
                    <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.05em] text-brand">✦ Resumen IA</p>
                    <p className="text-[11px] leading-relaxed text-text-secondary">{String(lead.ai_summary)}</p>
                  </div>
                ) : null}

                {/* Suggested action */}
                <div className="mt-3 rounded-[8px] border-[0.5px] border-border-tertiary bg-bg-secondary p-3">
                  <p className="text-[9px] text-text-tertiary">Acción sugerida</p>
                  <p className="mt-0.5 text-[11px] font-medium text-text-primary">{tempMeta.action}</p>
                </div>
              </div>
            )}

            {/* CONVERSACIÓN */}
            {activeTab === "conversacion" && (
              <div className="max-h-[480px] overflow-y-auto">
                <div className="space-y-2 pb-2">
                  {conversation.length === 0 ? (
                    <p className="py-6 text-center text-[11px] text-text-tertiary">Sin mensajes aún.</p>
                  ) : (
                    conversation.map((msg) => {
                      const role    = String(msg.role ?? "client");
                      const content = String(msg.content ?? "");
                      const isClient = role === "client";
                      const isBot    = role === "bot";

                      return (
                        <div
                          key={String(msg.id ?? Math.random())}
                          className={`flex ${isClient ? "justify-end" : "justify-start"}`}
                        >
                          {!isClient && (
                            <div className="mr-1.5 mt-auto shrink-0">
                              {isBot
                                ? <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[8px] text-white">✦</span>
                                : <span className="flex h-5 w-5 items-center justify-center rounded-full bg-bg-tertiary text-[8px]">A</span>
                              }
                            </div>
                          )}
                          <div
                            className={`max-w-[78%] rounded-[10px] px-3 py-2 text-[11px] leading-relaxed ${
                              isClient
                                ? "rounded-br-[3px] bg-brand text-white"
                                : isBot
                                ? "rounded-bl-[3px] border-[0.5px] border-brand-border bg-brand-light text-text-secondary"
                                : "rounded-bl-[3px] border-[0.5px] border-border-tertiary bg-bg-secondary text-text-secondary"
                            }`}
                          >
                            {content}
                            <p className={`mt-1 text-[8px] ${isClient ? "text-white/60 text-right" : "text-text-tertiary"}`}>
                              {relativeTime(msg.created_at as string | null)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={bottomRef} />
                </div>
              </div>
            )}

            {/* PROPS VISTAS */}
            {activeTab === "props" && (
              <div className="space-y-2">
                {matchedProps.length === 0 ? (
                  <p className="py-6 text-center text-[11px] text-text-tertiary">
                    No se encontraron propiedades activas que coincidan con el perfil.
                  </p>
                ) : (
                  matchedProps.map((prop) => {
                    const firstPhoto = Array.isArray(prop.photos)
                      ? (prop.photos as string[])[0]
                      : null;
                    const propSlug = String(prop.slug ?? prop.id ?? "");
                    return (
                      <a
                        key={String(prop.id)}
                        href={`/p/${propSlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex gap-3 rounded-[8px] border-[0.5px] border-border-tertiary p-3 hover:bg-bg-secondary"
                      >
                        {firstPhoto ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={firstPhoto}
                            alt=""
                            className="h-14 w-20 shrink-0 rounded-[6px] object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-[6px] bg-bg-tertiary text-[24px]">
                            🏠
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-[11px] font-medium text-text-primary">
                            {String(prop.title_es ?? "Propiedad")}
                          </p>
                          <p className="text-[10px] text-text-tertiary">
                            {String(prop.city ?? "")}
                          </p>
                          <p className="mt-1 text-[12px] font-medium text-brand-dark">
                            {prop.price_mxn
                              ? `$${Number(prop.price_mxn).toLocaleString("es-MX")}`
                              : "Precio a convenir"}
                          </p>
                        </div>
                      </a>
                    );
                  })
                )}
              </div>
            )}

            {/* TAREAS */}
            {activeTab === "tareas" && (
              <div className="space-y-3">
                {/* Add task */}
                <div className="flex gap-2">
                  <input
                    className="input-base flex-1 text-[11px]"
                    placeholder="Nueva tarea..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTask()}
                  />
                  <Button variant="primary" onClick={addTask} disabled={!newTask.trim()}>
                    +
                  </Button>
                </div>

                {tasks.length === 0 ? (
                  <p className="py-4 text-center text-[11px] text-text-tertiary">Sin tareas. Agrega la primera.</p>
                ) : (
                  <div className="space-y-1.5">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-2 rounded-[8px] border-[0.5px] border-border-tertiary px-3 py-2"
                      >
                        <button
                          type="button"
                          onClick={() => toggleTask(task.id)}
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-[0.5px] transition ${
                            task.done
                              ? "border-success bg-success text-white"
                              : "border-border-secondary bg-bg-secondary"
                          }`}
                        >
                          {task.done ? "✓" : ""}
                        </button>
                        <span
                          className={`flex-1 text-[11px] ${
                            task.done ? "text-text-tertiary line-through" : "text-text-primary"
                          }`}
                        >
                          {task.text}
                        </span>
                        <button
                          type="button"
                          onClick={() => deleteTask(task.id)}
                          className="text-[10px] text-text-tertiary hover:text-error"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* NOTAS */}
            {activeTab === "notas" && (
              <div className="space-y-3">
                <textarea
                  className="input-base min-h-[180px] text-[11px]"
                  placeholder="Escribe notas internas sobre este lead..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <div className="flex items-center gap-3">
                  <Button
                    variant="primary"
                    onClick={saveNotes}
                    disabled={savingNotes}
                  >
                    {savingNotes ? "Guardando..." : "Guardar notas"}
                  </Button>
                  {notesSaved && (
                    <span className="text-[11px] text-success">Guardado ✓</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Right sidebar — quick stats */}
        <aside className="space-y-3">
          <div className="rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary p-3">
            <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.05em] text-text-tertiary">
              Perfil de búsqueda
            </h3>
            <div className="space-y-2 text-[11px]">
              {lead?.preferred_type ? (
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Tipo</span>
                  <span className="font-medium capitalize text-text-primary">{String(lead.preferred_type)}</span>
                </div>
              ) : null}
              {lead?.budget_max ? (
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Presup.</span>
                  <span className="font-medium text-brand-dark">
                    ${Number(lead.budget_max).toLocaleString("es-MX")}
                  </span>
                </div>
              ) : null}
              {lead?.min_bedrooms ? (
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Rec. mín.</span>
                  <span className="font-medium text-text-primary">{String(lead.min_bedrooms)}</span>
                </div>
              ) : null}
              {leadCity ? (
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Ciudad</span>
                  <span className="font-medium text-text-primary">{leadCity}</span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary p-3">
            <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.05em] text-text-tertiary">
              Actividad
            </h3>
            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-text-tertiary">Creado</span>
                <span className="text-text-primary">
                  {relativeTime(lead?.created_at as string | null)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Último contacto</span>
                <span className="text-text-primary">
                  {relativeTime(lead?.last_contact_at as string | null)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Mensajes</span>
                <span className="text-text-primary">{conversation.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Estado</span>
                <span className="font-medium text-text-primary">{LEAD_STATUS_LABEL[leadStatus]}</span>
              </div>
            </div>
          </div>

          {/* Action card */}
          <div
            className="rounded-[12px] border-[0.5px] p-3"
            style={{ background: tempMeta.bg, borderColor: tempMeta.border }}
          >
            <p className="text-[9px] font-semibold uppercase tracking-[0.05em]" style={{ color: tempMeta.color }}>
              {tempMeta.emoji} {tempMeta.label} — Acción recomendada
            </p>
            <p className="mt-1 text-[12px] font-medium" style={{ color: tempMeta.color }}>
              {tempMeta.action}
            </p>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              <Button variant="whatsapp" full className="mt-3 text-[11px]">
                💬 Abrir WhatsApp
              </Button>
            </a>
          </div>
        </aside>
      </div>
    </PageWrapper>
  );
}

function SummaryRow({
  label,
  value,
  brand,
}: {
  label: string;
  value: string;
  brand?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b-[0.5px] border-border-tertiary py-2 last:border-0">
      <span className="text-[11px] text-text-tertiary">{label}</span>
      <span className={`text-[11px] font-medium ${brand ? "text-brand-dark" : "text-text-primary"}`}>
        {value}
      </span>
    </div>
  );
}
