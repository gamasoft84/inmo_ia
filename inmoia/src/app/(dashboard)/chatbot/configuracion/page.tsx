"use client";

import { useEffect, useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { getClientAgencyId } from "@/lib/agency/client-agency";

type TabId = "personalidad" | "horario" | "respuestas" | "escalado" | "alertas";

const tabs: { id: TabId; label: string }[] = [
  { id: "personalidad", label: "Personalidad" },
  { id: "horario", label: "Horario" },
  { id: "respuestas", label: "Respuestas" },
  { id: "escalado", label: "Escalado" },
  { id: "alertas", label: "Alertas" },
];

type EscalationAction = "notificar" | "notificar-y-agendar" | "tomar-control";

type BotConfig = {
  botName: string;
  tone: string;
  promptBase: string;
  bot24h: boolean;
  scheduleStart: string;
  scheduleEnd: string;
  greetingEs: string;
  greetingEn: string;
  autoScore: boolean;
  hotLeadThreshold: string;
  escalationAction: EscalationAction;
  takeoverAlert: boolean;
  alertEmail: string;
  dailySummary: boolean;
};

const DEFAULT_CONFIG: BotConfig = {
  botName: "Sofia",
  tone: "Profesional, calido, con emojis moderados",
  promptBase:
    "Eres Sofia, asistente inmobiliaria. Tu objetivo es calificar leads y agendar visitas con respuestas claras, empaticas y breves.",
  bot24h: true,
  scheduleStart: "08:00",
  scheduleEnd: "21:00",
  greetingEs:
    "¡Hola! Soy Sofia 🏡 de InmoIA. Te ayudo con propiedades, precios y visitas. ¿Que tipo de inmueble buscas?",
  greetingEn:
    "Hi! I am Sofia 🏡 from InmoIA. I can help with listings, pricing and visit scheduling. What are you looking for?",
  autoScore: true,
  hotLeadThreshold: "75",
  escalationAction: "notificar-y-agendar",
  takeoverAlert: true,
  alertEmail: "admin@agencia.com",
  dailySummary: true,
};

export default function BotConfigPage() {
  const [activeTab, setActiveTab] = useState<TabId>("personalidad");
  const [config, setConfig] = useState<BotConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string>("");
  const [agencyId, setAgencyId] = useState<string | null>(null);

  useEffect(() => {
    async function loadConfig() {
      setLoading(true);
      const resolvedAgencyId = getClientAgencyId();
      setAgencyId(resolvedAgencyId);

      if (!resolvedAgencyId) {
        setFeedback("Falta agencyId. Abre el dashboard con ?agencyId=<uuid> para cumplir arquitectura SaaS.");
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/chatbot/configuracion?agencyId=${encodeURIComponent(resolvedAgencyId)}`, {
        cache: "no-store",
        headers: { "x-agency-id": resolvedAgencyId },
      });
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.data) {
        setFeedback("No se pudo cargar la configuracion. Se usan valores por defecto.");
        setLoading(false);
        return;
      }

      setConfig({
        botName: json.data.botName ?? DEFAULT_CONFIG.botName,
        tone: json.data.tone ?? DEFAULT_CONFIG.tone,
        promptBase: json.data.promptBase ?? DEFAULT_CONFIG.promptBase,
        bot24h: json.data.bot24h ?? DEFAULT_CONFIG.bot24h,
        scheduleStart: json.data.scheduleStart ?? DEFAULT_CONFIG.scheduleStart,
        scheduleEnd: json.data.scheduleEnd ?? DEFAULT_CONFIG.scheduleEnd,
        greetingEs: json.data.greetingEs ?? DEFAULT_CONFIG.greetingEs,
        greetingEn: json.data.greetingEn ?? DEFAULT_CONFIG.greetingEn,
        autoScore: json.data.autoScore ?? DEFAULT_CONFIG.autoScore,
        hotLeadThreshold: String(json.data.hotLeadThreshold ?? DEFAULT_CONFIG.hotLeadThreshold),
        escalationAction: (json.data.escalationAction ?? DEFAULT_CONFIG.escalationAction) as EscalationAction,
        takeoverAlert: json.data.takeoverAlert ?? DEFAULT_CONFIG.takeoverAlert,
        alertEmail: json.data.alertEmail ?? DEFAULT_CONFIG.alertEmail,
        dailySummary: json.data.dailySummary ?? DEFAULT_CONFIG.dailySummary,
      });
      setLoading(false);
    }

    loadConfig();
  }, []);

  function updateField<K extends keyof BotConfig>(field: K, value: BotConfig[K]) {
    setConfig((prev) => ({ ...prev, [field]: value }));
  }

  async function saveConfig() {
    const resolvedAgencyId = agencyId || getClientAgencyId();
    if (!resolvedAgencyId) {
      setFeedback("No se puede guardar sin agencyId. Usa ?agencyId=<uuid>.");
      return;
    }

    setSaving(true);
    setFeedback("");

    const payload = {
      ...config,
      hotLeadThreshold: Number(config.hotLeadThreshold || "75"),
    };

    const res = await fetch(`/api/chatbot/configuracion?agencyId=${encodeURIComponent(resolvedAgencyId)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-agency-id": resolvedAgencyId,
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json().catch(() => null);
    if (!res.ok) {
      const message = json?.error ? `Error: ${json.error}` : "No se pudo guardar la configuracion.";
      setFeedback(json?.sql ? `${message} SQL: ${json.sql}` : message);
      setSaving(false);
      return;
    }

    setFeedback("Configuracion guardada correctamente.");
    setSaving(false);
  }

  return (
    <PageWrapper
      title="Configuracion de Sofia"
      actions={
        <>
          <Button variant="brand-soft" ai disabled>
            Probar prompt
          </Button>
          <Button variant="primary" onClick={saveConfig} disabled={loading || saving}>
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </>
      }
    >
      <section className="overflow-hidden rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary">
        <header className="border-b-[0.5px] border-border-tertiary bg-bg-secondary px-3 py-2">
          <h2 className="text-[12px] font-medium text-text-primary">Configuracion del bot</h2>
        </header>

        <div className="flex flex-wrap gap-1 border-b-[0.5px] border-border-tertiary px-3 pt-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-t-[8px] px-3 py-2 text-[10px] ${activeTab === tab.id ? "border-b-2 border-brand font-medium text-brand-dark" : "text-text-tertiary"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4">
          {loading ? <p className="mb-3 text-[11px] text-text-tertiary">Cargando configuracion...</p> : null}
          {!loading && feedback ? <p className="mb-3 text-[11px] text-text-secondary">{feedback}</p> : null}

          {activeTab === "personalidad" && (
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">NOMBRE DEL BOT</label>
                <input className="input-base" value={config.botName} onChange={(e) => updateField("botName", e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">TONO DE VOZ</label>
                <input className="input-base" value={config.tone} onChange={(e) => updateField("tone", e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">PROMPT BASE</label>
                <textarea className="input-base min-h-[110px]" value={config.promptBase} onChange={(e) => updateField("promptBase", e.target.value)} />
              </div>
            </div>
          )}

          {activeTab === "horario" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b-[0.5px] border-border-tertiary pb-2">
                <span className="text-[11px] text-text-primary">Bot activo 24/7</span>
                <Toggle checked={config.bot24h} onChange={(v) => updateField("bot24h", v)} />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">INICIO</label>
                  <input className="input-base" value={config.scheduleStart} onChange={(e) => updateField("scheduleStart", e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">FIN</label>
                  <input className="input-base" value={config.scheduleEnd} onChange={(e) => updateField("scheduleEnd", e.target.value)} />
                </div>
              </div>
              <p className="text-[10px] text-text-tertiary">Fuera de horario, Sofia envia mensaje de recepcion y agenda seguimiento automatico.</p>
            </div>
          )}

          {activeTab === "respuestas" && (
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">SALUDO ES</label>
                <textarea className="input-base min-h-[72px]" value={config.greetingEs} onChange={(e) => updateField("greetingEs", e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">SALUDO EN</label>
                <textarea className="input-base min-h-[72px]" value={config.greetingEn} onChange={(e) => updateField("greetingEn", e.target.value)} />
              </div>
            </div>
          )}

          {activeTab === "escalado" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b-[0.5px] border-border-tertiary pb-2">
                <span className="text-[11px] text-text-primary">Auto-score de leads</span>
                <Toggle checked={config.autoScore} onChange={(v) => updateField("autoScore", v)} />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">UMBRAL LEAD CALIENTE</label>
                <input className="input-base" value={config.hotLeadThreshold} onChange={(e) => updateField("hotLeadThreshold", e.target.value.replace(/[^0-9]/g, ""))} />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">ACCION AUTOMATICA</label>
                <select className="input-base" value={config.escalationAction} onChange={(e) => updateField("escalationAction", e.target.value as EscalationAction)}>
                  <option value="notificar">Solo notificar agente</option>
                  <option value="notificar-y-agendar">Notificar + sugerir visita</option>
                  <option value="tomar-control">Solicitar toma de control</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === "alertas" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b-[0.5px] border-border-tertiary pb-2">
                <span className="text-[11px] text-text-primary">Alerta al tomar control manual</span>
                <Toggle checked={config.takeoverAlert} onChange={(v) => updateField("takeoverAlert", v)} />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">EMAIL DE ALERTAS</label>
                <input className="input-base" value={config.alertEmail} onChange={(e) => updateField("alertEmail", e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">RESUMEN DIARIO</label>
                <select className="input-base" value={config.dailySummary ? "si" : "no"} onChange={(e) => updateField("dailySummary", e.target.value === "si")}>
                  <option value="si">Enviar resumen diario</option>
                  <option value="no">No enviar resumen</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </section>
    </PageWrapper>
  );
}
