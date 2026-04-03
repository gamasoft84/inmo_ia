"use client";

import { useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/Button";
import { Steps } from "@/components/ui/Steps";

const steps = [
  { id: "datos", label: "Datos" },
  { id: "fotos", label: "Fotos" },
  { id: "descripcion", label: "Descripcion" },
  { id: "publicar", label: "Publicar" },
];

export default function NuevaPropiedadPage() {
  const [current, setCurrent] = useState("fotos");

  return (
    <PageWrapper
      title="Nueva propiedad"
      actions={
        <>
          <Button variant="brand-soft" ai>
            Generar descripcion
          </Button>
          <Button variant="primary">Guardar borrador</Button>
        </>
      }
    >
      <div className="grid gap-3 xl:grid-cols-[1.25fr_1fr]">
        <section className="rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary">
          <div className="border-b-[0.5px] border-border-tertiary p-3">
            <Steps steps={steps} current={current} />
          </div>

          <div className="grid gap-3 p-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">TIPO DE PROPIEDAD</label>
              <input className="input-base" defaultValue="Casa" />
            </div>
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">PRECIO (MXN)</label>
              <input className="input-base" defaultValue="$5,800,000" />
            </div>
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">SUPERFICIE</label>
              <input className="input-base" defaultValue="210m²" />
            </div>
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">RECAMARAS</label>
              <input className="input-base" defaultValue="3" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-[10px] uppercase tracking-[0.03em] text-text-tertiary">TITULO (detectado por IA ✦)</label>
              <input className="input-base ai-filled" defaultValue="Casa con jardin en Coyoacan" />
            </div>
          </div>

          <div className="flex items-center justify-between border-t-[0.5px] border-border-tertiary p-3">
            <Button variant="ghost" onClick={() => setCurrent("datos")}>← Anterior</Button>
            <Button variant="primary" onClick={() => setCurrent("descripcion")}>Continuar →</Button>
          </div>
        </section>

        <section className="rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-secondary p-3">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[12px] font-medium text-text-primary">✦ Claude analiza tus fotos</h2>
            <span className="badge-ai">✦ Claude Vision</span>
          </div>

          <div className="mb-3 grid grid-cols-4 gap-2">
            <div className="relative aspect-[4/3] rounded-[8px] bg-gradient-to-br from-[#8B7355] to-[#C4A882] text-center text-[20px] leading-[60px]">🏡</div>
            <div className="relative aspect-[4/3] rounded-[8px] bg-gradient-to-br from-[#4a6fa5] to-[#7aa7d4] text-center text-[20px] leading-[60px]">🛋️</div>
            <div className="relative aspect-[4/3] rounded-[8px] bg-gradient-to-br from-[#228B22] to-[#90EE90] text-center text-[20px] leading-[60px]">🌿</div>
            <div className="relative aspect-[4/3] rounded-[8px] bg-gradient-to-br from-[#C0C0C0] to-[#E8E8E8] text-center text-[20px] leading-[60px]">🍳</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between border-b-[0.5px] border-border-tertiary pb-2 text-[11px]">
              <span className="text-text-tertiary">Tipo detectado</span>
              <span className="font-medium text-text-primary">Casa residencial <span className="ml-1 rounded-full bg-success-light px-1.5 py-[1px] text-[8px] text-success">97%</span></span>
            </div>
            <div className="flex items-center justify-between border-b-[0.5px] border-border-tertiary pb-2 text-[11px]">
              <span className="text-text-tertiary">Acabados</span>
              <span className="font-medium text-text-primary">Premium <span className="ml-1 rounded-full bg-success-light px-1.5 py-[1px] text-[8px] text-success">89%</span></span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-text-tertiary">Precio estimado</span>
              <span className="font-medium text-brand-dark">$5.5M–$6.5M</span>
            </div>
          </div>

          <p className="mt-3 text-[10px] leading-relaxed text-text-tertiary">
            Flujo: subes 3-5 fotos, Claude pre-llena campos y genera 4 versiones de descripcion en segundos.
          </p>
        </section>
      </div>
    </PageWrapper>
  );
}
