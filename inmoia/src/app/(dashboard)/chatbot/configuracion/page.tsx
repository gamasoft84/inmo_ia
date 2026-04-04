"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";

type TabId = "personalidad" | "horario" | "respuestas" | "escalado" | "alertas";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "personalidad", label: "Personalidad", icon: "🤖" },
  { id: "horario",      label: "Horario",       icon: "🕐" },
  { id: "respuestas",   label: "Respuestas",    icon: "💬" },
  { id: "escalado",     label: "Escalado",      icon: "🔥" },
  { id: "alertas",      label: "Alertas",       icon: "🔔" },
];

type EscalationAction = "notificar" | "notificar-y-agendar" | "tomar-control";

type BotConfig = {
  botName: string;
  tone: string;
  promptBase: string;
  languages: string[];
  bot24h: boolean;
  scheduleStart: string;
  scheduleEnd: string;
  offHoursMessage: string;
  greetingEs: string;
  greetingEn: string;
  faqReplies: { question: string; answer: string }[];
  autoScore: boolean;
  hotLeadThreshold: string;
  escalationAction: EscalationAction;
  autoScheduleVisit: boolean;
  takeoverAlert: boolean;
  alertEmail: string;
  alertWhatsapp: string;
  dailySummary: boolean;
  hotLeadAlert: boolean;
};

const DEFAULT_CONFIG: BotConfig = {
  botName:          "Sofía",
  tone:             "Profesional, cálido, con emojis moderados",
  promptBase:       "Eres Sofía, asistente inmobiliaria. Tu objetivo es calificar leads y agendar visitas con respuestas claras, empáticas y breves.",
  languages:        ["es"],
  bot24h:           true,
  scheduleStart:    "08:00",
  scheduleEnd:      "21:00",
  offHoursMessage:  "¡Hola! Soy Sofía 🏡 En este momento estamos fuera de horario, pero te responderemos mañana a primera hora. ¡Gracias por tu interés!",
  greetingEs:       "¡Hola! Soy Sofía 🏡 de InmoIA. Te ayudo con propiedades, precios y visitas. ¿Qué tipo de inmueble buscas?",
  greetingEn:       "Hi! I'm Sofía 🏡 from InmoIA. I can help with listings, pricing and visit scheduling. What are you looking for?",
  faqReplies:       [
    { question: "¿Cuánto cuesta?",         answer: "El precio depende de la propiedad. Cuéntame tu presupuesto y te muestro opciones." },
    { question: "¿Dónde están ubicados?",  answer: "Tenemos propiedades en varias zonas. ¿Qué ciudad o colonia te interesa?" },
    { question: "¿Aceptan crédito?",       answer: "¡Sí! Trabajamos con Infonavit, Fovissste y crédito bancario. ¿Tienes alguno preaprobado?" },
  ],
  autoScore:           true,
  hotLeadThreshold:    "75",
  escalationAction:    "notificar-y-agendar",
  autoScheduleVisit:   true,
  takeoverAlert:       true,
  alertEmail:          "",
  alertWhatsapp:       "",
  dailySummary:        true,
  hotLeadAlert:        true,
};

export default function BotConfigPage() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<TabId>("personalidad");
  const [config, setConfig] = useState<BotConfig>(DEFAULT_CONFIG);
  const [agencyId, setAgencyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "ok" | "error"; msg: string } | null>(null);
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });

  // Carga agencyId desde auth (no desde URL params)
  useEffect(() => {
    async function init() {
      const { data: authData } = await supabase.auth.getUser();
      const uid = authData.user?.id;
      if (!uid) { setLoading(false); return; }

      const { data: userRow } = await supabase
        .from("users")
        .select("agency_id")
        .eq("id", uid)
        .single();

      const aid = userRow?.agency_id ? String(userRow.agency_id) : null;
      setAgencyId(aid);

      if (!aid) { setLoading(false); return; }

      const res = await fetch(`/api/chatbot/configuracion?agencyId=${encodeURIComponent(aid)}`);
      const json = await res.json().catch(() => null);

      if (res.ok && json?.data) {
        setConfig({ ...DEFAULT_CONFIG, ...json.data });
      }
      setLoading(false);
    }
    init();
  }, [supabase]);

  function set<K extends keyof BotConfig>(field: K, value: BotConfig[K]) {
    setConfig((prev) => ({ ...prev, [field]: value }));
  }

  function toggleLanguage(lang: string) {
    setConfig((prev) => {
      const langs = prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang];
      return { ...prev, languages: langs.length ? langs : prev.languages };
    });
  }

  function addFaq() {
    if (!newFaq.question.trim() || !newFaq.answer.trim()) return;
    set("faqReplies", [...config.faqReplies, { ...newFaq }]);
    setNewFaq({ question: "", answer: "" });
  }

  function removeFaq(i: number) {
    set("faqReplies", config.faqReplies.filter((_, idx) => idx !== i));
  }

  async function save() {
    if (!agencyId) {
      setFeedback({ type: "error", msg: "No se puede guardar sin agencyId." });
      return;
    }
    setSaving(true);
    setFeedback(null);

    const res = await fetch(`/api/chatbot/configuracion?agencyId=${encodeURIComponent(agencyId)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-agency-id": agencyId },
      body: JSON.stringify({ ...config, hotLeadThreshold: Number(config.hotLeadThreshold || "75") }),
    });
    const json = await res.json().catch(() => null);
    setSaving(false);

    if (!res.ok) {
      setFeedback({ type: "error", msg: json?.error ?? "No se pudo guardar la configuración." });
      return;
    }
    setFeedback({ type: "ok", msg: "Configuración guardada correctamente." });
  }

  return (
    <PageWrapper
      title={`Configuración de ${config.botName}`}
      actions={
        <>
          <Button variant="brand-soft" ai disabled>✦ Probar prompt</Button>
          <Button variant="primary" onClick={save} disabled={loading || saving}>
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </>
      }
    >
      {feedback && (
        <div className={`mb-3 rounded-[8px] border-[0.5px] px-3 py-2 text-[11px] ${
          feedback.type === "ok"
            ? "border-success-border bg-success-light text-success"
            : "border-error-border bg-error-light text-error"
        }`}>
          {feedback.msg}
        </div>
      )}

      <div className="grid gap-3 xl:grid-cols-[1fr_320px]">
        {/* Panel principal */}
        <section className="overflow-hidden rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary">
          {/* Tabs */}
          <div className="flex overflow-x-auto border-b-[0.5px] border-border-tertiary">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-1.5 px-4 py-3 text-[11px] font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-b-2 border-brand text-brand"
                    : "text-text-tertiary hover:text-text-secondary"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4">
            {loading && <p className="text-[11px] text-text-tertiary">Cargando configuración...</p>}

            {/* ─── PERSONALIDAD ─── */}
            {!loading && activeTab === "personalidad" && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">NOMBRE DEL BOT</label>
                    <input className="input-base" value={config.botName} onChange={(e) => set("botName", e.target.value)} placeholder="Sofía" />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">TONO DE VOZ</label>
                    <select className="input-base" value={config.tone} onChange={(e) => set("tone", e.target.value)}>
                      <option value="Profesional, cálido, con emojis moderados">Profesional y cálido (recomendado)</option>
                      <option value="Muy formal, sin emojis">Muy formal</option>
                      <option value="Casual y amigable, con emojis">Casual y amigable</option>
                      <option value="Directo y conciso, sin rodeos">Directo y conciso</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">INSTRUCCIONES BASE PARA CLAUDE</label>
                  <textarea
                    className="input-base min-h-[110px]"
                    value={config.promptBase}
                    onChange={(e) => set("promptBase", e.target.value)}
                  />
                  <p className="mt-1 text-[10px] text-text-tertiary">Claude recibe esto como contexto de sistema en cada conversación.</p>
                </div>

                <div>
                  <label className="mb-2 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">IDIOMAS</label>
                  <div className="flex gap-2">
                    {[{ id: "es", label: "🇲🇽 Español" }, { id: "en", label: "🇺🇸 English" }].map((lang) => (
                      <button
                        key={lang.id}
                        type="button"
                        onClick={() => toggleLanguage(lang.id)}
                        className={`chip ${config.languages.includes(lang.id) ? "active" : ""}`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                  <p className="mt-1 text-[10px] text-text-tertiary">Sofía detecta el idioma del cliente automáticamente.</p>
                </div>
              </div>
            )}

            {/* ─── HORARIO ─── */}
            {!loading && activeTab === "horario" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-[8px] border-[0.5px] border-border-tertiary bg-bg-secondary p-3">
                  <div>
                    <p className="text-[11px] font-medium text-text-primary">Bot activo 24/7</p>
                    <p className="text-[10px] text-text-tertiary">Responde a cualquier hora, todos los días</p>
                  </div>
                  <Toggle checked={config.bot24h} onChange={(v) => set("bot24h", v)} />
                </div>

                {!config.bot24h && (
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">HORA DE INICIO</label>
                      <input type="time" className="input-base" value={config.scheduleStart} onChange={(e) => set("scheduleStart", e.target.value)} />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">HORA DE CIERRE</label>
                      <input type="time" className="input-base" value={config.scheduleEnd} onChange={(e) => set("scheduleEnd", e.target.value)} />
                    </div>
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">MENSAJE FUERA DE HORARIO</label>
                  <textarea
                    className="input-base min-h-[80px]"
                    value={config.offHoursMessage}
                    onChange={(e) => set("offHoursMessage", e.target.value)}
                  />
                  <p className="mt-1 text-[10px] text-text-tertiary">Se envía automáticamente cuando el bot recibe un mensaje fuera de su horario.</p>
                </div>
              </div>
            )}

            {/* ─── RESPUESTAS ─── */}
            {!loading && activeTab === "respuestas" && (
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">SALUDO INICIAL (ESPAÑOL)</label>
                  <textarea className="input-base min-h-[72px]" value={config.greetingEs} onChange={(e) => set("greetingEs", e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">SALUDO INICIAL (ENGLISH)</label>
                  <textarea className="input-base min-h-[72px]" value={config.greetingEn} onChange={(e) => set("greetingEn", e.target.value)} />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-[10px] uppercase tracking-[0.03em] text-text-tertiary">RESPUESTAS RÁPIDAS (FAQ)</label>
                    <span className="text-[10px] text-text-tertiary">{config.faqReplies.length} configuradas</span>
                  </div>

                  <div className="space-y-2">
                    {config.faqReplies.map((faq, i) => (
                      <div key={i} className="rounded-[8px] border-[0.5px] border-border-tertiary bg-bg-secondary p-3">
                        <div className="mb-1 flex items-start justify-between gap-2">
                          <p className="text-[11px] font-medium text-text-primary">{faq.question}</p>
                          <button type="button" onClick={() => removeFaq(i)} className="shrink-0 text-[10px] text-error hover:underline">Eliminar</button>
                        </div>
                        <p className="text-[11px] text-text-secondary">{faq.answer}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 rounded-[8px] border-[0.5px] border-dashed border-border-secondary p-3">
                    <p className="mb-2 text-[10px] font-medium text-text-tertiary">AGREGAR RESPUESTA</p>
                    <input
                      className="input-base mb-2"
                      placeholder="Pregunta del cliente..."
                      value={newFaq.question}
                      onChange={(e) => setNewFaq((p) => ({ ...p, question: e.target.value }))}
                    />
                    <textarea
                      className="input-base mb-2 min-h-[60px]"
                      placeholder="Respuesta de Sofía..."
                      value={newFaq.answer}
                      onChange={(e) => setNewFaq((p) => ({ ...p, answer: e.target.value }))}
                    />
                    <Button variant="ghost" onClick={addFaq} disabled={!newFaq.question.trim() || !newFaq.answer.trim()}>
                      + Agregar
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* ─── ESCALADO ─── */}
            {!loading && activeTab === "escalado" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-[8px] border-[0.5px] border-border-tertiary bg-bg-secondary p-3">
                  <div>
                    <p className="text-[11px] font-medium text-text-primary">Auto-score de leads con IA</p>
                    <p className="text-[10px] text-text-tertiary">Claude calcula probabilidad de cierre tras cada conversación</p>
                  </div>
                  <Toggle checked={config.autoScore} onChange={(v) => set("autoScore", v)} />
                </div>

                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">UMBRAL LEAD CALIENTE (0–100)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range" min="0" max="100"
                      className="flex-1"
                      value={config.hotLeadThreshold}
                      onChange={(e) => set("hotLeadThreshold", e.target.value)}
                    />
                    <span className="w-10 text-center text-[13px] font-medium text-brand-dark">{config.hotLeadThreshold}</span>
                  </div>
                  <p className="mt-1 text-[10px] text-text-tertiary">Score ≥ {config.hotLeadThreshold} → 🔥 Lead caliente → notificación inmediata al agente</p>
                </div>

                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">ACCIÓN AUTOMÁTICA AL DETECTAR LEAD CALIENTE</label>
                  <select className="input-base" value={config.escalationAction} onChange={(e) => set("escalationAction", e.target.value as EscalationAction)}>
                    <option value="notificar">Solo notificar al agente</option>
                    <option value="notificar-y-agendar">Notificar + Sofía sugiere visita</option>
                    <option value="tomar-control">Solicitar toma de control al agente</option>
                  </select>
                </div>

                <div className="flex items-center justify-between rounded-[8px] border-[0.5px] border-border-tertiary bg-bg-secondary p-3">
                  <div>
                    <p className="text-[11px] font-medium text-text-primary">Agendar visita automáticamente</p>
                    <p className="text-[10px] text-text-tertiary">Sofía propone horarios disponibles cuando el lead muestra interés</p>
                  </div>
                  <Toggle checked={config.autoScheduleVisit} onChange={(v) => set("autoScheduleVisit", v)} />
                </div>
              </div>
            )}

            {/* ─── ALERTAS ─── */}
            {!loading && activeTab === "alertas" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-[8px] border-[0.5px] border-border-tertiary bg-bg-secondary p-3">
                  <div>
                    <p className="text-[11px] font-medium text-text-primary">Alerta de lead caliente</p>
                    <p className="text-[10px] text-text-tertiary">Notificación inmediata cuando score ≥ {config.hotLeadThreshold}</p>
                  </div>
                  <Toggle checked={config.hotLeadAlert} onChange={(v) => set("hotLeadAlert", v)} />
                </div>

                <div className="flex items-center justify-between rounded-[8px] border-[0.5px] border-border-tertiary bg-bg-secondary p-3">
                  <div>
                    <p className="text-[11px] font-medium text-text-primary">Alerta al tomar control manual</p>
                    <p className="text-[10px] text-text-tertiary">Avisa cuando un agente toma el chat</p>
                  </div>
                  <Toggle checked={config.takeoverAlert} onChange={(v) => set("takeoverAlert", v)} />
                </div>

                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">EMAIL PARA ALERTAS</label>
                  <input type="email" className="input-base" value={config.alertEmail} onChange={(e) => set("alertEmail", e.target.value)} placeholder="admin@agencia.com" />
                </div>

                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">WHATSAPP PARA ALERTAS</label>
                  <input type="tel" className="input-base" value={config.alertWhatsapp} onChange={(e) => set("alertWhatsapp", e.target.value)} placeholder="+52 33 1234 5678" />
                </div>

                <div className="flex items-center justify-between rounded-[8px] border-[0.5px] border-border-tertiary bg-bg-secondary p-3">
                  <div>
                    <p className="text-[11px] font-medium text-text-primary">Resumen diario por email</p>
                    <p className="text-[10px] text-text-tertiary">Envío automático cada mañana con leads, visitas y métricas del día anterior</p>
                  </div>
                  <Toggle checked={config.dailySummary} onChange={(v) => set("dailySummary", v)} />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Preview del bot */}
        <aside className="space-y-3">
          <div className="rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[12px] font-medium text-text-primary">Vista previa</p>
              <span className="badge-ai">✦ Sofía</span>
            </div>
            <div className="rounded-[8px] bg-[var(--wa-bg)] p-2">
              {/* Header WA */}
              <div className="mb-2 flex items-center gap-2 rounded-[6px] bg-[var(--wa-dark)] px-2 py-1.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
                  {config.botName.charAt(0)}
                </div>
                <div>
                  <p className="text-[10px] font-medium text-white">{config.botName}</p>
                  <p className="text-[8px] text-white/60">InmoIA · Bot activo</p>
                </div>
              </div>
              {/* Messages */}
              <div className="space-y-1.5 px-1 py-1">
                <div className="max-w-[85%] rounded-[2px_10px_10px_10px] bg-white px-2.5 py-1.5 text-[10px] leading-relaxed text-gray-800 shadow-sm">
                  {config.greetingEs || DEFAULT_CONFIG.greetingEs}
                </div>
                <div className="ml-auto max-w-[85%] rounded-[10px_2px_10px_10px] bg-[var(--wa-bubble)] px-2.5 py-1.5 text-[10px] leading-relaxed text-gray-800 shadow-sm">
                  Hola, busco casa en Coyoacán
                </div>
                <div className="max-w-[85%] rounded-[2px_10px_10px_10px] bg-white px-2.5 py-1.5 text-[10px] leading-relaxed text-gray-800 shadow-sm">
                  ¡Perfecto! Tengo opciones en Coyoacán 🏡 ¿Cuántas recámaras necesitas y cuál es tu presupuesto aproximado?
                </div>
              </div>
            </div>
          </div>

          {/* Config summary */}
          <div className="rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary p-3 text-[11px]">
            <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-text-tertiary">Resumen de configuración</p>
            <div className="space-y-1.5">
              <Row label="Bot" value={config.botName} />
              <Row label="Horario" value={config.bot24h ? "24/7" : `${config.scheduleStart} – ${config.scheduleEnd}`} />
              <Row label="Idiomas" value={config.languages.map((l) => l === "es" ? "ES" : "EN").join(" + ")} />
              <Row label="Lead caliente" value={`Score ≥ ${config.hotLeadThreshold}`} />
              <Row label="Acción" value={config.escalationAction} />
              <Row label="Resumen diario" value={config.dailySummary ? "Activo" : "Desactivado"} />
            </div>
          </div>
        </aside>
      </div>
    </PageWrapper>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b-[0.5px] border-border-tertiary pb-1.5 last:border-0 last:pb-0">
      <span className="text-text-tertiary">{label}</span>
      <span className="font-medium text-text-primary">{value}</span>
    </div>
  );
}
