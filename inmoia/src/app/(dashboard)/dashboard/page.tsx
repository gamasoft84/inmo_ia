"use client";

import { useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SkeletonBlock, SkeletonLine } from "@/components/ui/Skeleton";
import { Spinner } from "@/components/ui/Spinner";
import { Steps } from "@/components/ui/Steps";
import { Toast } from "@/components/ui/Toast";
import { Toggle } from "@/components/ui/Toggle";

const steps = [
  { id: "base", label: "Datos base" },
  { id: "ia", label: "Analisis IA" },
  { id: "publicar", label: "Publicar" },
];

export default function DashboardPage() {
  const [open, setOpen] = useState(false);
  const [chipActive, setChipActive] = useState(true);

  return (
    <PageWrapper
      title="Dashboard"
      actions={
        <>
          <Button variant="brand-soft" ai>
            Generar resumen
          </Button>
          <Button variant="primary">Nueva propiedad</Button>
        </>
      }
    >
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Card title="Botones">
          <div className="flex flex-wrap gap-2">
            <Button variant="primary">Principal</Button>
            <Button variant="brand-soft" ai>
              IA
            </Button>
            <Button variant="ghost">Secundario</Button>
            <Button variant="danger">Eliminar</Button>
            <Button variant="whatsapp">WhatsApp</Button>
          </div>
        </Card>

        <Card title="Inputs y estado IA" brand>
          <div className="space-y-2">
            <Input label="Titulo" placeholder="Casa en Coyoacan" />
            <Input label="Descripcion" value="Generada por IA" readOnly aiFilled />
          </div>
        </Card>

        <Card title="Chips, badges y avatar">
          <div className="flex items-center gap-2">
            <Chip active={chipActive} onClick={() => setChipActive((prev) => !prev)}>
              Filtro activo
            </Chip>
            <Badge ai>IA</Badge>
            <Avatar initials="RG" size="md" />
          </div>
        </Card>

        <Card title="Toggle y progreso">
          <div className="space-y-3">
            <Toggle defaultChecked label="Bot 24h" />
            <ProgressBar value={68} />
          </div>
        </Card>

        <Card title="Steps">
          <Steps steps={steps} current="ia" />
        </Card>

        <Card title="Feedback">
          <div className="space-y-2">
            <Toast variant="success" title="Lead caliente detectado" description="Score 82/100" withProgress />
            <div className="flex items-center gap-3">
              <Spinner />
              <SkeletonLine className="w-28" />
            </div>
            <SkeletonBlock />
          </div>
        </Card>
      </div>

      <div className="mt-3 rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary">
        <EmptyState
          icon="📭"
          title="Sin leads nuevos"
          description="Cuando lleguen mensajes por WhatsApp apareceran aqui."
          action={
            <Button variant="brand-soft" ai>
              Sugerir campana
            </Button>
          }
          secondaryAction={<Button variant="ghost">Ver tutorial</Button>}
        />
      </div>

      <div className="mt-3">
        <Button variant="ghost" onClick={() => setOpen(true)}>
          Abrir modal de ejemplo
        </Button>
      </div>

      <Modal open={open} title="Confirmar accion" onClose={() => setOpen(false)}>
        <p className="text-[11px] leading-relaxed text-text-secondary">
          Este modal usa bordes de 0.5px, radio 12px y tipografia del sistema para mantener consistencia.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={() => setOpen(false)}>
            Aceptar
          </Button>
        </div>
      </Modal>
    </PageWrapper>
  );
}
