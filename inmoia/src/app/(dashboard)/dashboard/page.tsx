import Link from "next/link";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";

const stats = [
  { label: "LEADS HOY", value: "23" },
  { label: "BOT AUTO", value: "83%" },
  { label: "VISITAS", value: "6" },
  { label: "PROPS", value: "31" },
];

const leads = [
  { id: "carlos-mendoza", initials: "CM", name: "Carlos Mendoza", meta: "Casa Coyoacan · hace 5 min", temp: "hot" },
  { id: "ana-torres", initials: "AT", name: "Ana Torres", meta: "Depto Santa Fe · hace 2h", temp: "warm" },
  { id: "roberto-silva", initials: "RS", name: "Roberto Silva", meta: "Terreno Huatulco · ayer", temp: "cold" },
];

const tempStyles = {
  hot: "bg-error-light text-error",
  warm: "bg-brand-light text-brand-dark",
  cold: "bg-bg-secondary text-text-tertiary",
};

const tempLabel = {
  hot: "caliente",
  warm: "tibio",
  cold: "frio",
};

export default function DashboardPage() {
  return (
    <PageWrapper
      title="Dashboard"
      actions={
        <>
          <Button variant="brand-soft" ai>
            Generar resumen
          </Button>
          <Link href="/propiedades/nueva" className="btn btn-primary">
            <span>Nueva propiedad</span>
          </Link>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary p-4">
            <p className="text-[9px] font-medium tracking-[0.05em] text-text-tertiary">{item.label}</p>
            <p className="mt-1 text-[28px] font-medium leading-none tracking-[-0.02em] text-brand">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-[12px] border-[0.5px] border-brand-border bg-brand-light px-3 py-2 text-[11px] text-brand-text">
        🔥 Carlos Mendoza es lead caliente · Score 87/100
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-[1.35fr_1fr]">
        <section className="rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary">
          <header className="flex items-center justify-between border-b-[0.5px] border-border-tertiary px-4 py-3">
            <h2 className="text-[12px] font-medium">Leads recientes</h2>
            <Link href="/leads" className="text-[10px] text-brand">
              Ver todos →
            </Link>
          </header>

          <div>
            {leads.map((lead) => (
              <Link
                href={`/leads/${lead.id}`}
                key={lead.id}
                className="flex items-center gap-2 border-b-[0.5px] border-border-tertiary px-4 py-3 last:border-b-0"
              >
                <div className="avatar avatar-sm">{lead.initials}</div>
                <div className="flex-1">
                  <p className="text-[12px] font-medium text-text-primary">{lead.name}</p>
                  <p className="text-[10px] text-text-tertiary">{lead.meta}</p>
                </div>
                <span className={`pill ${tempStyles[lead.temp as keyof typeof tempStyles]}`}>
                  {tempLabel[lead.temp as keyof typeof tempLabel]}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary p-4">
          <h2 className="text-[12px] font-medium">Actividad del chatbot</h2>
          <p className="mt-1 text-[11px] text-text-tertiary">Sofia esta respondiendo el 83% de conversaciones sin ayuda.</p>

          <div className="mt-4 space-y-3">
            <div>
              <div className="mb-1 flex items-center justify-between text-[10px] text-text-secondary">
                <span>Autonomia del bot</span>
                <span>83%</span>
              </div>
              <ProgressBar value={83} />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between text-[10px] text-text-secondary">
                <span>Tiempo medio de respuesta</span>
                <span>1.8s</span>
              </div>
              <ProgressBar value={92} />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between text-[10px] text-text-secondary">
                <span>Leads calificados hoy</span>
                <span>14/23</span>
              </div>
              <ProgressBar value={61} />
            </div>
          </div>

          <Link href="/chatbot" className="mt-4 inline-block text-[10px] text-brand">
            Ir al panel del chatbot →
          </Link>
        </section>
      </div>
    </PageWrapper>
  );
}
