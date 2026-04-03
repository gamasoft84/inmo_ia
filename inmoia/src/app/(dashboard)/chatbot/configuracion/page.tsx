"use client";

import { useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";

type TabId = "personalidad" | "horario" | "respuestas" | "escalado" | "alertas";

const tabs: { id: TabId; label: string }[] = [
  { id: "personalidad", label: "Personalidad" },
  { id: "horario", label: "Horario" },
  { id: "respuestas", label: "Respuestas" },
  { id: "escalado", label: "Escalado" },
  { id: "alertas", label: "Alertas" },
];

export default function BotConfigPage() {
  const [activeTab, setActiveTab] = useState<TabId>("personalidad");
  const [bot24h, setBot24h] = useState(true);
  const [autoScore, setAutoScore] = useState(true);
  const [takeoverAlert, setTakeoverAlert] = useState(true);

  return (
    <PageWrapper
      title="Configuracion de Sofia"
      actions={
        <>
          <Button variant="brand-soft" ai>
            Probar prompt
          </Button>
          <Button variant="primary">Guardar cambios</Button>
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
          {activeTab === "personalidad" && (
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">NOMBRE DEL BOT</label>
                <input className="input-base" defaultValue="Sofia" />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">TONO DE VOZ</label>
                <input className="input-base" defaultValue="Profesional, calido, con emojis moderados" />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">PROMPT BASE</label>
                <textarea className="input-base min-h-[110px]" defaultValue="Eres Sofia, asistente inmobiliaria. Tu objetivo es calificar leads y agendar visitas con respuestas claras, empaticas y breves." />
              </div>
            </div>
          )}

          {activeTab === "horario" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b-[0.5px] border-border-tertiary pb-2">
                <span className="text-[11px] text-text-primary">Bot activo 24/7</span>
                <Toggle checked={bot24h} onChange={setBot24h} />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">INICIO</label>
                  <input className="input-base" defaultValue="08:00" />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">FIN</label>
                  <input className="input-base" defaultValue="21:00" />
                </div>
              </div>
              <p className="text-[10px] text-text-tertiary">Fuera de horario, Sofia envia mensaje de recepcion y agenda seguimiento automatico.</p>
            </div>
          )}

          {activeTab === "respuestas" && (
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">SALUDO ES</label>
                <textarea className="input-base min-h-[72px]" defaultValue="¡Hola! Soy Sofia 🏡 de InmoIA. Te ayudo con propiedades, precios y visitas. ¿Que tipo de inmueble buscas?" />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">SALUDO EN</label>
                <textarea className="input-base min-h-[72px]" defaultValue="Hi! I am Sofia 🏡 from InmoIA. I can help with listings, pricing and visit scheduling. What are you looking for?" />
              </div>
            </div>
          )}

          {activeTab === "escalado" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b-[0.5px] border-border-tertiary pb-2">
                <span className="text-[11px] text-text-primary">Auto-score de leads</span>
                <Toggle checked={autoScore} onChange={setAutoScore} />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">UMBRAL LEAD CALIENTE</label>
                <input className="input-base" defaultValue="75" />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">ACCION AUTOMATICA</label>
                <select className="input-base" defaultValue="notificar-y-agendar">
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
                <Toggle checked={takeoverAlert} onChange={setTakeoverAlert} />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">EMAIL DE ALERTAS</label>
                <input className="input-base" defaultValue="admin@agencia.com" />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">RESUMEN DIARIO</label>
                <select className="input-base" defaultValue="si">
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
