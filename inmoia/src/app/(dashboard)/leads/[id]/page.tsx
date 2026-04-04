"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/Button";

type LeadTab = "resumen" | "conversacion" | "props" | "tareas" | "notas";
type Row = Record<string, unknown>;

const tabs: { id: LeadTab; label: string }[] = [
  { id: "resumen", label: "Resumen" },
  { id: "conversacion", label: "Conversacion" },
  { id: "props", label: "Props vistas" },
  { id: "tareas", label: "Tareas" },
  { id: "notas", label: "Notas" },
];

export default function LeadDetailPage() {
  const supabase = createClient();
  const params = useParams<{ id: string }>();
  const leadId = params?.id;

  const [activeTab, setActiveTab] = useState<LeadTab>("resumen");
  const [lead, setLead] = useState<Row | null>(null);
  const [conversation, setConversation] = useState<Row[]>([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!leadId) return;

      const [{ data: leadData }, { data: conversationData }] = await Promise.all([
        supabase.from("leads").select("*").eq("id", leadId).maybeSingle(),
        supabase.from("conversations").select("*").eq("lead_id", leadId).order("created_at", { ascending: true }).limit(40),
      ]);

      if (!mounted) return;
      setLead(leadData ?? null);
      setConversation(conversationData ?? []);
    }

    void load();
    return () => {
      mounted = false;
    };
  }, [leadId, supabase]);

  const leadName = (lead?.name as string | undefined) ?? "Lead";
  const leadPhone = (lead?.phone as string | undefined) ?? "Sin telefono";
  const leadCity = (lead?.city as string | undefined) ?? "Sin ciudad";
  const leadScore = Number(lead?.ai_score ?? 0);
  const preferredZones = Array.isArray(lead?.preferred_zones)
    ? (lead?.preferred_zones as string[]).join(", ")
    : leadCity;

  return (
    <PageWrapper
      title="Detalle de lead"
      actions={
        <>
          <Button variant="brand-soft" ai>
            Sugerir siguiente accion
          </Button>
          <Button variant="whatsapp">WhatsApp</Button>
        </>
      }
    >
      <section className="rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary">
        <div className="flex items-center gap-3 border-b-[0.5px] border-border-tertiary bg-bg-secondary px-4 py-3">
          <div className="avatar avatar-md">
            {leadName
              .split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map((p: string) => p[0]?.toUpperCase() ?? "")
              .join("") || "--"}
          </div>
          <div>
            <p className="text-[14px] font-medium text-text-primary">{leadName}</p>
            <p className="text-[10px] text-text-tertiary">📱 {leadPhone} · {leadCity}</p>
          </div>
          <div className="ml-auto flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] border-error-border bg-error-light text-[12px] font-semibold text-error">
            {leadScore}
          </div>
        </div>

        <div className="flex flex-wrap gap-1 border-b-[0.5px] border-border-tertiary px-3 pt-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-t-[8px] px-3 py-2 text-[10px] ${
                activeTab === tab.id
                  ? "border-b-2 border-brand text-brand-dark font-medium"
                  : "text-text-tertiary"
              }`}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4">
          {activeTab === "resumen" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b-[0.5px] border-border-tertiary pb-2 text-[11px]">
                <span className="text-text-tertiary">Presupuesto</span>
                <span className="font-medium text-brand-dark">
                  {lead?.budget_max ? `Hasta $${Number(lead.budget_max).toLocaleString("es-MX")}` : "Sin dato"}
                </span>
              </div>
              <div className="flex items-center justify-between border-b-[0.5px] border-border-tertiary pb-2 text-[11px]">
                <span className="text-text-tertiary">Zona preferida</span>
                <span className="font-medium text-text-primary">{preferredZones}</span>
              </div>
              <div className="flex items-center justify-between border-b-[0.5px] border-border-tertiary pb-2 text-[11px]">
                <span className="text-text-tertiary">Urgencia</span>
                <span className="font-medium text-error">{(lead?.urgency as string | undefined) ?? "Sin dato"}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-text-tertiary">Match con catalogo</span>
                <span className="font-medium text-success">{(lead?.preferred_type as string | undefined) ?? "Sin dato"}</span>
              </div>
            </div>
          )}

          {activeTab === "conversacion" && (
            <div className="space-y-2 text-[11px] text-text-secondary">
              {conversation.map((msg) => (
                <p key={String(msg.id ?? Math.random())}>
                  {String(msg.role ?? "client")}: {String(msg.content ?? "")}
                </p>
              ))}
              {conversation.length === 0 ? <p>Sin mensajes aun.</p> : null}
            </div>
          )}

          {activeTab === "props" && (
            <div className="space-y-2 text-[11px] text-text-secondary">
              <p>Preferencia: {(lead?.preferred_type as string | undefined) ?? "Sin dato"}</p>
              <p>Ciudad: {leadCity}</p>
              <p>Estatus: {(lead?.status as string | undefined) ?? "new"}</p>
            </div>
          )}

          {activeTab === "tareas" && (
            <div className="space-y-2 text-[11px] text-text-secondary">
              <p>✓ Confirmar visita para manana 10:00</p>
              <p>• Enviar ficha tecnica por WhatsApp</p>
              <p>• Preparar comparativo de dos opciones</p>
            </div>
          )}

          {activeTab === "notas" && (
            <div className="space-y-2 text-[11px] text-text-secondary">
              <p>{(lead?.notes as string | undefined) ?? "Sin notas registradas."}</p>
            </div>
          )}
        </div>
      </section>
    </PageWrapper>
  );
}
