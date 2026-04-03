"use client";

import { useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/Button";

type LeadTab = "resumen" | "conversacion" | "props" | "tareas" | "notas";

const tabs: { id: LeadTab; label: string }[] = [
  { id: "resumen", label: "Resumen" },
  { id: "conversacion", label: "Conversacion" },
  { id: "props", label: "Props vistas" },
  { id: "tareas", label: "Tareas" },
  { id: "notas", label: "Notas" },
];

export default function LeadDetailPage() {
  const [activeTab, setActiveTab] = useState<LeadTab>("resumen");

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
          <div className="avatar avatar-md">CM</div>
          <div>
            <p className="text-[14px] font-medium text-text-primary">Carlos Mendoza</p>
            <p className="text-[10px] text-text-tertiary">📱 55 1234 5678 · CDMX</p>
          </div>
          <div className="ml-auto flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] border-error-border bg-error-light text-[12px] font-semibold text-error">
            87
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
                <span className="font-medium text-brand-dark">Hasta $6,000,000</span>
              </div>
              <div className="flex items-center justify-between border-b-[0.5px] border-border-tertiary pb-2 text-[11px]">
                <span className="text-text-tertiary">Zona preferida</span>
                <span className="font-medium text-text-primary">Coyoacan, Sur CDMX</span>
              </div>
              <div className="flex items-center justify-between border-b-[0.5px] border-border-tertiary pb-2 text-[11px]">
                <span className="text-text-tertiary">Urgencia</span>
                <span className="font-medium text-error">Alta · este mes</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-text-tertiary">Match con catalogo</span>
                <span className="font-medium text-success">Casa Coyoacan ✓</span>
              </div>
            </div>
          )}

          {activeTab === "conversacion" && (
            <div className="space-y-2 text-[11px] text-text-secondary">
              <p>10:33 Cliente: Me interesa la casa de Coyoacan.</p>
              <p>10:34 Sofia: Te puedo agendar visita manana 10am o jueves 3pm.</p>
              <p>10:35 Cliente: Manana 10am me funciona.</p>
            </div>
          )}

          {activeTab === "props" && (
            <div className="space-y-2 text-[11px] text-text-secondary">
              <p>🏡 Casa Coyoacan · $5,800,000</p>
              <p>🏠 Casa Pedregal · $6,200,000</p>
              <p>🏢 Depto Del Valle · $4,900,000</p>
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
              <p>Prefiere zona sur por cercania a su trabajo.</p>
              <p>Busca jardin amplio para su mascota.</p>
            </div>
          )}
        </div>
      </section>
    </PageWrapper>
  );
}
