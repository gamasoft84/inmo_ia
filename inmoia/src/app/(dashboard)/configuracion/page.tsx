import Link from "next/link";
import { PageWrapper } from "@/components/layout/PageWrapper";

export default function ConfiguracionPage() {
  return (
    <PageWrapper title="Configuracion">
      <div className="grid gap-3 md:grid-cols-2">
        <article className="rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary p-4">
          <p className="text-[12px] font-medium text-text-primary">Chatbot de WhatsApp</p>
          <p className="mt-1 text-[11px] text-text-secondary">
            Personalidad, horario, respuestas, escalado y alertas de Sofia.
          </p>
          <Link href="/chatbot/configuracion" className="btn btn-brand-soft mt-3 inline-flex">
            <span>✦ Abrir configuracion del chatbot</span>
          </Link>
        </article>

        <article className="rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary p-4">
          <p className="text-[12px] font-medium text-text-primary">Ajustes de agencia</p>
          <p className="mt-1 text-[11px] text-text-secondary">
            Modulo en construccion. Mientras tanto puedes operar el bot desde la seccion de chatbot.
          </p>
        </article>
      </div>
    </PageWrapper>
  );
}
